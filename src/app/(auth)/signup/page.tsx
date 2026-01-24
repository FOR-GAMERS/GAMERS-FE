"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormValues } from "@/schemas/auth-schema";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Loader2, Mail, Lock, User, Hash } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SignUpPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
  } = useForm<SignUpFormValues>({
      resolver: zodResolver(signUpSchema),
      mode: "onChange"
  });

  useGSAP(() => {
      gsap.from(".animate-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all"
      });
  }, { scope: containerRef });

  const onSubmit = async (data: SignUpFormValues) => {
      try {
          await authService.register(data);
          addToast("Account created successfully! Please log in.", "success");
          router.push("/login"); // Redirect to login page
      } catch (error: any) {
          addToast(error.message || "Failed to create account.", "error");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div ref={containerRef} className="w-full max-w-md bg-deep-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
            <div className="text-center mb-8 animate-item">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                    Join GAMERS
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Create your account and start your journey.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ... existing form fields ... */}
                
                {/* Email */}
                <div className="space-y-2 animate-item">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email</label>
                    <div className="relative">
                        <input 
                            {...register("email")}
                            type="email"
                            placeholder="name@example.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-white/20"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                </div>

                {/* Username */}
                <div className="space-y-2 animate-item">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Username</label>
                    <div className="relative">
                        <input 
                            {...register("username")}
                            type="text"
                            placeholder="PlayerOne"
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-white/20"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    </div>
                    {errors.username && <p className="text-red-500 text-xs ml-1">{errors.username.message}</p>}
                </div>

                {/* Tag */}
                <div className="space-y-2 animate-item">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tag (Handle)</label>
                    <div className="relative">
                        <input 
                            {...register("tag")}
                            type="text"
                            placeholder="#1234"
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-white/20"
                        />
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    </div>
                    {errors.tag && <p className="text-red-500 text-xs ml-1">{errors.tag.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2 animate-item">
                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Password</label>
                    <div className="relative">
                        <input 
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-white/20"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full animate-item bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl py-3.5 mt-8 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Creating Account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-muted-foreground animate-item">
                Already have an account?{" "}
                <Link href="/login" className="text-neon-cyan hover:text-neon-cyan/80 font-bold transition-colors">
                    Log In
                </Link>
            </div>
        </div>
    </div>
  );
}
