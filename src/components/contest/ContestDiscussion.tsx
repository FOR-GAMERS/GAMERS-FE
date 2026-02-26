"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, Loader2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestService } from '@/services/contest-service';
import { useToast } from '@/context/ToastContext';
import { useMe } from '@/hooks/use-user';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

interface ContestDiscussionProps {
  contestId: number;
}

export default function ContestDiscussion({ contestId }: ContestDiscussionProps) {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data: userResponse } = useMe();
  const user = userResponse?.data;
  
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  const { data: commentsResponse, isLoading } = useQuery({
    queryKey: ['contest-comments', contestId],
    queryFn: () => contestService.getComments(contestId),
    enabled: !!contestId,
  });

  const comments = commentsResponse?.data?.data || [];

  const postMutation = useMutation({
    mutationFn: (content: string) => contestService.createComment(contestId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-comments', contestId] });
      setNewComment("");
      addToast(t('contestDiscussion.postSuccess', 'Comment posted!'), 'success');
    },
    onError: () => {
      addToast(t('contestDiscussion.postError', 'Failed to post comment. Make sure you are logged in.'), 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number, content: string }) => 
      contestService.updateComment(contestId, commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-comments', contestId] });
      setEditingCommentId(null);
      setEditContent("");
      addToast(t('contestDiscussion.updateSuccess', 'Comment updated!'), 'success');
    },
    onError: () => {
      addToast(t('contestDiscussion.updateError', 'Failed to update comment.'), 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => contestService.deleteComment(contestId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-comments', contestId] });
      addToast(t('contestDiscussion.deleteSuccess', 'Comment deleted!'), 'success');
    },
    onError: () => {
      addToast(t('contestDiscussion.deleteError', 'Failed to delete comment.'), 'error');
    }
  });

  const handleUpdate = (commentId: number) => {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    updateMutation.mutate({ commentId, content: trimmed });
  };

  const handlePost = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    postMutation.mutate(trimmed);
  };

  const currentLocale = i18n.language === 'ko' ? ko : enUS;

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageSquare className="text-neon-cyan" size={24} />
            {t('contestDiscussion.title', 'Discussion')}
        </h2>
        
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 mb-8 focus-within:border-neon-cyan/50 transition-colors relative">
            <textarea 
                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-neutral-600 resize-none min-h-[100px] outline-none"
                placeholder={t('contestDiscussion.placeholder', 'Share your thoughts about this match...')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={postMutation.isPending}
            ></textarea>
            <div className="flex justify-end mt-4 pt-4 border-t border-neutral-800">
                <button 
                  onClick={handlePost}
                  disabled={!newComment.trim() || postMutation.isPending}
                  className="bg-neon-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-full transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    {postMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {t('contestDiscussion.postButton', 'Post Comment')}
                </button>
            </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
             <Loader2 size={32} className="text-neon-cyan animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 border-dashed">
              <p className="text-neutral-600 flex flex-col items-center gap-2">
                  <MessageSquare size={32} className="opacity-20" />
                  {t('contestDiscussion.noComments', 'No comments yet. Be the first to cheer!')}
              </p>
          </div>
        ) : (
          <div className="space-y-4">
             {comments.map((comment) => {
                const getAvatarSrc = (author: any) => {
                    if (author.avatar?.startsWith('http')) return author.avatar;
                    if (author.profile_key && author.avatar) {
                        return `https://cdn.discordapp.com/avatars/${author.profile_key}/${author.avatar}.png`;
                    }
                    return "/img/discord-avatar.png";
                };
                
                return (
                <div key={comment.comment_id} className="bg-neutral-900/30 p-5 rounded-2xl border border-neutral-800/50 flex gap-4 relative group">
                  <img src={getAvatarSrc(comment.author)} alt={comment.author.username} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-white leading-none truncate">{comment.author.username}</span>
                        <span className="text-xs text-neutral-500 font-mono leading-none shrink-0">#{comment.author.tag}</span>
                        <span className="text-xs text-neutral-600 ml-2 leading-none shrink-0">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: currentLocale })}
                          {comment.created_at !== comment.modified_at && " (edited)"}
                        </span>
                      </div>
                      {user?.user_id === comment.author.user_id && (
                        <div className="relative shrink-0">
                          <button 
                            onClick={() => setActiveDropdownId(activeDropdownId === comment.comment_id ? null : comment.comment_id)}
                            className="text-neutral-500 hover:text-white p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeDropdownId === comment.comment_id && (
                            <div className="absolute right-0 mt-1 w-32 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl overflow-hidden z-10">
                              <button 
                                onClick={() => {
                                  setEditingCommentId(comment.comment_id);
                                  setEditContent(comment.content);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white flex items-center gap-2"
                              >
                                <Edit2 size={14} /> {t('contestDiscussion.edit', 'Edit')}
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(t('contestDiscussion.confirmDelete', 'Are you sure you want to delete this comment?'))) {
                                    deleteMutation.mutate(comment.comment_id);
                                  }
                                  setActiveDropdownId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 hover:text-red-300 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> {t('contestDiscussion.delete', 'Delete')}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.comment_id ? (
                      <div className="mt-2">
                        <textarea 
                          className="w-full bg-neutral-950/50 border border-neutral-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan outline-none resize-none min-h-[80px]"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          disabled={updateMutation.isPending}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditContent("");
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                            disabled={updateMutation.isPending}
                          >
                            {t('common.cancel', 'Cancel')}
                          </button>
                          <button 
                            onClick={() => handleUpdate(comment.comment_id)}
                            disabled={!editContent.trim() || editContent === comment.content || updateMutation.isPending}
                            className="bg-neon-cyan hover:bg-cyan-400 text-black px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 disabled:opacity-50 transition-colors"
                          >
                            {updateMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : null}
                            {t('common.save', 'Save')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-300 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                    )}
                  </div>
                </div>
                );
             })}
          </div>
        )}
    </div>
  );
}
