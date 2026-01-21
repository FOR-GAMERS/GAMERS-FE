'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMe } from '@/hooks/use-user';
import { Loader2, Save, User, Lock, Mail, FileText, Hash } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api-client';
import { UpdateUserRequest } from '@/types/api';

interface ProfileEditFormValues {
  username: string;
  tag: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  password?: string;
  passwordConfirm?: string;
}

export default function ProfileEditSection() {
  const { data: userResponse, isLoading: isUserLoading } = useMe();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const user = userResponse?.data;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileEditFormValues>();
  
  // Watch password to validate confirm password
  const password = watch('password');

  useEffect(() => {
    if (user) {
      setValue('username', user.username || '');
      setValue('tag', user.tag || '');
      setValue('bio', user.bio || '');
      setValue('avatarUrl', user.avatar || '');
      // Banner not in user object yet, skip or use mock
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileEditFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Password Update (Supported by API)
      if (data.password) {
        if (data.password !== data.passwordConfirm) {
           addToast('비밀번호가 일치하지 않습니다.', 'error');
           setIsSaving(false);
           return;
        }

        await api.patch(`/users/${user.user_id}`, {
          password: data.password
        } as UpdateUserRequest);
        
        addToast('비밀번호가 변경되었습니다.', 'success');
      }

      // 2. Profile Info Update (Mock / Not fully supported by API yet)
      // Since API only lists password in UpdateUserRequest, we'll just show a toast for now
      // or try to send if we think backend silently supports it.
      // Based on plan: "If API only updates password, only send password or show toast"
      
      if (data.username !== user.username || data.bio !== user.bio || data.tag !== user.tag) {
         // Temporarily show message until API supports it
         addToast('프로필 정보 수정은 아직 지원되지 않습니다. (비밀번호 제외)', 'info');
      }

    } catch (error: any) {
      addToast(error.message || '프로필 수정 실패', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <User className="text-neon-cyan" size={24} />
        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <User size={14} /> Username
              </label>
              <input 
                {...register('username')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                placeholder="Username" 
              />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <Hash size={14} /> Tag
              </label>
               <div className="flex items-center gap-2">
                   <span className="text-white/50">#</span>
                   <input 
                     {...register('tag')}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                     placeholder="0000" 
                   />
               </div>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText size={14} /> Bio
           </label>
           <textarea 
             {...register('bio')}
             className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white min-h-[100px] resize-none transition-colors"
             placeholder="Tell us about yourself..." 
           />
        </div>

        {/* Password Section */}
        <div className="pt-4 border-t border-white/5 space-y-4">
           <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Change Password</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} /> New Password
                 </label>
                 <input 
                   {...register('password')}
                   type="password"
                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                   placeholder="Enter new password" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} /> Confirm Password
                 </label>
                 <input 
                   {...register('passwordConfirm', { 
                       validate: (val) => !password || val === password || 'Passwords do not match' 
                   })}
                   type="password"
                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                   placeholder="Confirm new password" 
                 />
                 {errors.passwordConfirm && <span className="text-xs text-red-500">{errors.passwordConfirm.message}</span>}
              </div>
           </div>
        </div>

        <div className="pt-4">
           <button 
             type="submit" 
             disabled={isSaving}
             className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 rounded-xl text-neon-cyan font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Save Changes
           </button>
        </div>

      </form>
    </div>
  );
}
