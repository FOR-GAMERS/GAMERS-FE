'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';

export function LoginForm() {
  const { t } = useTranslation();
  const { mutate: login, isPending, error } = useLogin();

  const loginSchema = React.useMemo(() => z.object({
    email: z.string().email(t('auth.login.validation.email_invalid')),
    password: z.string().min(1, t('auth.login.validation.password_required')),
  }), [t]);

  type LoginFormValues = z.infer<typeof loginSchema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const handleDiscordLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.gamers.io.kr';
    window.location.href = `${apiUrl}/api/oauth2/discord/login`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col justify-center w-full max-w-[320px] mx-auto"
    >
      <div className="space-y-2">
        <h2 className="text-4xl uppercase text-[#EEEEF0] font-barlow font-black leading-[1.1] tracking-tight">
          {t('auth.login.title').split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </h2>
        <p className="text-[#7A7A85] font-inter text-sm font-medium">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
        {/* Email & Password Fields */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A85] ml-1">{t('auth.login.fields.email_label')}</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A55] group-focus-within:text-[#6EE7B7] transition-colors" />
              <Input 
                {...register('email')}
                type="email" 
                placeholder={t('auth.login.fields.email_placeholder')} 
                className="pl-10 bg-[#1A1A20] border-[#24242B] focus:border-[#6EE7B7]/50 h-11 text-sm transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 ml-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A85]">{t('auth.login.fields.password_label')}</label>
              <Link href="#" className="text-[11px] font-bold text-[#4A4A55] hover:text-[#6EE7B7] transition-colors">{t('auth.login.fields.find_password')}</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A55] group-focus-within:text-[#6EE7B7] transition-colors" />
              <Input 
                {...register('password')}
                type="password" 
                placeholder={t('auth.login.fields.password_placeholder')} 
                className="pl-10 bg-[#1A1A20] border-[#24242B] focus:border-[#6EE7B7]/50 h-11 text-sm transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 ml-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 ml-1">{(error as any).message || t('auth.login.error_failed')}</p>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-[#6EE7B7] hover:bg-[#5EEAD4] text-[#0C0C0F] font-bold h-11 mt-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.login.submit_btn')}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="grow h-px bg-[#242428]" />
          <span className="text-[#4A4A55] font-inter text-[10px] uppercase font-bold tracking-[0.2em]">{t('auth.common.divider_or')}</span>
          <div className="grow h-px bg-[#242428]" />
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            type="button"
            onClick={handleDiscordLogin}
            variant="discord" 
            className="w-full gap-2 h-11 group text-xs px-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
               <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#FFFFFF" />
            </svg>
            {t('auth.common.discord')}
          </Button>

          <Button variant="riot" className="w-full gap-2 h-11 group text-xs px-2">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#D13639" />
              <path d="M10 10h12v2h-5v10h-2V12h-5V10z" fill="#FFFFFF" />
            </svg>
            Riot
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#7A7A85] text-[13px]">{t('auth.login.footer.no_account')}</span>
          <Link href="/signup" className="text-[#6EE7B7] hover:text-white font-bold text-[13px] transition-all hover:tracking-wide">
            {t('auth.login.footer.signup_link')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
