'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { useMe } from '@/hooks/use-user';
import { Loader2, Save, User, Lock, Mail, FileText, Hash, AlertCircle } from 'lucide-react';
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

  // Set form values when user data is loaded
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileEditFormValues>();
  
  const password = watch('password');

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('tag', user.tag || '');
      setValue('bio', user.bio || '');
    }
  }, [user, setValue]);

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
         await api.patch(`/users/${user.user_id}`, {
           username: data.username,
           tag: data.tag,
           bio: data.bio
         });
         addToast(t("mypage.edit.toast.updated") || "Profile updated", 'success');
      }

    } catch (error: any) {
      addToast(error.message || t("mypage.edit.toast.failed"), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const onWithdraw = async () => {
    if (!user) return;
    if (!confirm(t("mypage.edit.withdrawal.confirm") || "Are you sure you want to delete your account? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/users/${user.user_id}`);
      addToast(t("mypage.edit.withdrawal.success") || "Account deleted", 'success');
      window.location.href = '/';
    } catch (error: any) {
      addToast(error.message || t("mypage.edit.withdrawal.failed") || "Failed to delete account", 'error');
    }
  };

  if (isUserLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="group relative glass-card p-6 md:p-10 space-y-10 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="p-3 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20">
            <User className="text-neon-cyan" size={24} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t("mypage.edit.title")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                  <User size={14} className="text-neon-cyan/60" /> {t("mypage.edit.username")}
                </label>
                <input 
                  {...register('username')}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-neon-cyan/50 focus:bg-white/[0.05] outline-none text-white transition-all shadow-inner font-bold placeholder:text-white/10"
                  placeholder={t("mypage.edit.username")} 
                />
            </div>
            <div className="space-y-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                  <Hash size={14} className="text-neon-cyan/60" /> {t("mypage.edit.tag")}
                </label>
                <div className="relative flex items-center">
                    <span className="absolute left-5 text-neon-cyan font-black">#</span>
                    <input 
                      {...register('tag')}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-sm focus:border-neon-cyan/50 focus:bg-white/[0.05] outline-none text-white transition-all shadow-inner font-bold placeholder:text-white/10"
                      placeholder="0000" 
                    />
                </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                <FileText size={14} className="text-neon-cyan/60" /> {t("mypage.edit.bio")}
            </label>
            <textarea 
              {...register('bio')}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-neon-cyan/50 focus:bg-white/[0.05] outline-none text-white min-h-[120px] resize-none transition-all shadow-inner font-medium leading-relaxed placeholder:text-white/10"
              placeholder={t("mypage.edit.bio")} 
            />
          </div>

          <div className="pt-10 border-t border-white/5 space-y-8">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">{t("mypage.edit.changePassword")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Lock size={14} className="text-neon-cyan/60" /> {t("mypage.edit.newPassword")}
                  </label>
                  <input 
                    {...register('password')}
                    type="password"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-neon-cyan/50 focus:bg-white/[0.05] outline-none text-white transition-all shadow-inner font-bold placeholder:text-white/10"
                    placeholder={t("mypage.edit.newPassword")} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                      <Lock size={14} className="text-neon-cyan/60" /> {t("mypage.edit.confirmPassword")}
                  </label>
                  <input 
                    {...register('passwordConfirm', { 
                        validate: (val) => !password || val === password || t("mypage.edit.toast.passwordMismatch")
                    })}
                    type="password"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-neon-cyan/50 focus:bg-white/[0.05] outline-none text-white transition-all shadow-inner font-bold placeholder:text-white/10"
                    placeholder={t("mypage.edit.confirmPassword")} 
                  />
                  {errors.passwordConfirm && <span className="text-xs text-red-500 font-bold mt-1 block">{errors.passwordConfirm.message}</span>}
                </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-3 px-10 py-4 bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_40px_rgba(0,243,255,0.4)] border border-neon-cyan/30 hover:border-neon-cyan disabled:opacity-50 active:scale-95"
            >
                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                {t("mypage.edit.save")}
            </button>
          </div>
        </form>
      </div>

      <div className="group relative glass-card p-6 md:p-10 space-y-6 border border-red-500/10 hover:border-red-500/30 transition-colors shadow-[0_8px_32px_rgba(239,68,68,0.05)]">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t("mypage.edit.withdrawal.title") || "Service Withdrawal"}</h2>
          </div>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-2xl">
              {t("mypage.edit.withdrawal.description") || "Deleting your account is permanent and cannot be reversed. All your data including match history and tournament records will be removed."}
          </p>
          <div className="pt-4">
              <button 
                onClick={onWithdraw}
                className="px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] active:scale-95"
              >
                  {t("mypage.edit.withdrawal.button") || "Withdraw Service"}
              </button>
          </div>
      </div>
    </div>
  );
}
