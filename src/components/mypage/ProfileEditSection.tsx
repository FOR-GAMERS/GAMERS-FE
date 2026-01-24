'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { data: userResponse, isLoading: isUserLoading } = useMe();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const user = userResponse?.data;

  // ... (useForm hook)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileEditFormValues>();
  
  const password = watch('password');

  // ... (useEffect)

  const onSubmit = async (data: ProfileEditFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Password Update
      if (data.password) {
        if (data.password !== data.passwordConfirm) {
           addToast(t("mypage.edit.toast.passwordMismatch"), 'error');
           setIsSaving(false);
           return;
        }

        await api.patch(`/users/${user.user_id}`, {
          password: data.password
        } as UpdateUserRequest);
        
        addToast(t("mypage.edit.toast.passwordChanged"), 'success');
      }

      // 2. Profile Info Update
      if (data.username !== user.username || data.bio !== user.bio || data.tag !== user.tag) {
         addToast(t("mypage.edit.toast.updateNotSupported"), 'info');
      }

    } catch (error: any) {
      addToast(error.message || t("mypage.edit.toast.failed"), 'error');
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
        <h2 className="text-xl font-bold text-white">{t("mypage.edit.title")}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <User size={14} /> {t("mypage.edit.username")}
              </label>
              <input 
                {...register('username')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                placeholder={t("mypage.edit.username")} 
              />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <Hash size={14} /> {t("mypage.edit.tag")}
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
              <FileText size={14} /> {t("mypage.edit.bio")}
           </label>
           <textarea 
             {...register('bio')}
             className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white min-h-[100px] resize-none transition-colors"
             placeholder={t("mypage.edit.bio")} 
           />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-4">
           <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">{t("mypage.edit.changePassword")}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} /> {t("mypage.edit.newPassword")}
                 </label>
                 <input 
                   {...register('password')}
                   type="password"
                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                   placeholder={t("mypage.edit.newPassword")} 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock size={14} /> {t("mypage.edit.confirmPassword")}
                 </label>
                 <input 
                   {...register('passwordConfirm', { 
                       validate: (val) => !password || val === password || t("mypage.edit.toast.passwordMismatch")
                   })}
                   type="password"
                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-cyan outline-none text-white transition-colors"
                   placeholder={t("mypage.edit.confirmPassword")} 
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
              {t("mypage.edit.save")}
           </button>
        </div>

      </form>
    </div>
  );
}
