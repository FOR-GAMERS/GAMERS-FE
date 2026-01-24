import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification-service';
import { NotificationResponse } from '@/types/api';
import { useToast } from '@/context/ToastContext';

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Fetch initial notifications
  const { data: initialData, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications({ page: 1, page_size: 20, only_unread: true }),
    enabled: enabled,
  });

  // Sync state with query data
  useEffect(() => {
    if (initialData?.data) {
      setNotifications(initialData.data.notifications);
      setUnreadCount(initialData.data.unread_count);
    }
  }, [initialData]);

  // SSE Connection
  useEffect(() => {
    if (!enabled) return;

    const streamUrl = notificationService.getStreamUrl();
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data) as NotificationResponse;
        
        // Add to list (prepend)
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Optional: Show toast
        addToast(newNotification.title || 'New Notification', 'info');
        
        // Invalidate queries if needed (e.g., if notification affects other data)
        if (newNotification.type.includes('TEAM') || newNotification.type.includes('APPLICATION')) {
            queryClient.invalidateQueries({ queryKey: ['contest-applications'] });
            queryClient.invalidateQueries({ queryKey: ['contest-members'] });
            queryClient.invalidateQueries({ queryKey: ['my-application'] });
        }

      } catch (error) {
        console.error('Failed to parse notification event', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      // Simple retry logic could be implemented here or rely on browser reconnection (browser usually retries)
      // If closed, we might want to try to reopen after delay, or just let it be.
      // Standard EventSource auto-retries on connection loss, but close() stops it.
      // If error is fatal (401), we should probably stop.
      // For now, let's keep it open unless explicit auth failure, 
      // but EventSource API doesn't give status code easily.
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, addToast, queryClient]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      if (unreadCount === 0) return;
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  }, [unreadCount]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch
  };
}
