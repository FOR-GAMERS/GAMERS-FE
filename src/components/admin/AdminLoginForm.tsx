'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminLoginSchema, type AdminLoginFormValues } from '@/lib/validations/admin-schema';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export function AdminLoginForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    console.log('Admin Login Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // alert('Admin Login Attempted (Check console)');
  };

  return (
    <div className="w-full max-w-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight font-outfit whitespace-pre-line">
          {t('admin.login.title')}
        </h1>
        <p className="text-[#7A7A85] text-lg">
          {t('admin.login.subtitle')}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 ml-1">
            {t('admin.login.fields.email_label')}
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7A85] group-focus-within:text-neon-cyan transition-colors">
              <Mail size={18} />
            </div>
            <Input
              {...register('email')}
              type="email"
              placeholder={t('admin.login.fields.email_placeholder')}
              className={cn(
                "pl-12 bg-white/5 border-white/10 focus:border-neon-cyan/50 focus:ring-neon-cyan/20 h-14 text-base",
                errors.email && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-medium text-white/70">
              {t('admin.login.fields.password_label')}
            </label>
            <button 
              type="button" 
              className="text-xs font-semibold text-neon-cyan hover:text-white transition-colors"
            >
              {t('admin.login.fields.find_password')}
            </button>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7A85] group-focus-within:text-neon-cyan transition-colors">
              <Lock size={18} />
            </div>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('admin.login.fields.password_placeholder')}
              className={cn(
                "pl-12 pr-12 bg-white/5 border-white/10 focus:border-neon-cyan/50 focus:ring-neon-cyan/20 h-14 text-base",
                errors.password && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7A85] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2 ml-1">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-neon-cyan focus:ring-neon-cyan focus:ring-offset-0"
          />
          <label htmlFor="rememberMe" className="text-sm text-[#7A7A85] cursor-pointer select-none">
            {t('admin.login.fields.remember_me')}
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-neon-cyan text-black font-bold text-lg rounded-xl hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              {t('admin.login.submit_btn')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[#7A7A85] text-sm">
          {t('admin.login.footer.not_admin')}{' '}
          <Link href="/" className="text-neon-cyan font-semibold hover:underline">
            {t('admin.login.footer.return_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}
