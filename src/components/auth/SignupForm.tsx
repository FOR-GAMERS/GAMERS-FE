'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignup, useDiscordLogin } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';

export function SignupForm() {
  const { t } = useTranslation();
  const { mutate: signup, isPending, error } = useSignup();
  const { login: discordLogin } = useDiscordLogin();

  const signupSchema = React.useMemo(() => z.object({
    username: z.string().min(2, t('auth.signup.validation.username_min')),
    email: z.string().email(t('auth.signup.validation.email_invalid')),
    password: z.string().min(8, t('auth.signup.validation.password_min')),
  }), [t]);

  type SignupFormValues = z.infer<typeof signupSchema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signup(data);
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
          {t('auth.signup.title').split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </h2>
        <p className="text-[#7A7A85] font-inter text-sm font-medium">
          {t('auth.signup.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
        <div className="space-y-3">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A85] ml-1">{t('auth.signup.fields.username_label')}</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A55] group-focus-within:text-[#6EE7B7] transition-colors" />
              <Input 
                {...register('username')}
                placeholder={t('auth.signup.fields.username_placeholder')} 
                className="pl-10 bg-[#1A1A20] border-[#24242B] focus:border-[#6EE7B7]/50 h-11 text-sm transition-all"
              />
            </div>
            {errors.username && (
              <p className="text-[11px] text-red-500 ml-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A85] ml-1">{t('auth.signup.fields.email_label')}</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A55] group-focus-within:text-[#6EE7B7] transition-colors" />
              <Input 
                {...register('email')}
                type="email" 
                placeholder={t('auth.signup.fields.email_placeholder')} 
                className="pl-10 bg-[#1A1A20] border-[#24242B] focus:border-[#6EE7B7]/50 h-11 text-sm transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 ml-1">{errors.email.message}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A85] ml-1">{t('auth.signup.fields.password_label')}</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A55] group-focus-within:text-[#6EE7B7] transition-colors" />
              <Input 
                {...register('password')}
                type="password" 
                placeholder={t('auth.signup.fields.password_placeholder')} 
                className="pl-10 bg-[#1A1A20] border-[#24242B] focus:border-[#6EE7B7]/50 h-11 text-sm transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 ml-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 ml-1">{(error as any).message || t('auth.signup.error_failed')}</p>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-[#6EE7B7] hover:bg-[#5EEAD4] text-[#0C0C0F] font-bold h-11 mt-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.signup.submit_btn')}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="grow h-px bg-[#242428]" />
          <span className="text-[#4A4A55] font-inter text-[10px] uppercase font-bold tracking-[0.2em]">{t('auth.common.divider_or')}</span>
          <div className="grow h-px bg-[#242428]" />
        </div>

        {/* Social Login */}
        <Button 
          type="button"
          onClick={() => discordLogin()}
          variant="discord" 
          className="w-full gap-3 group h-11"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
             <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#FFFFFF" />
          </svg>
          {t('auth.signup.social.discord_continue')}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#7A7A85] text-[13px]">{t('auth.signup.footer.has_account')}</span>
          <Link href="/login" className="text-[#6EE7B7] hover:text-white font-bold text-[13px] transition-all hover:tracking-wide">
            {t('auth.signup.footer.login_link')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
