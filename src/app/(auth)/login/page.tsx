"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください。");
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "パスワードは8文字以上で、大文字、小文字、特殊文字(!@#$%^&*)を含める必要があります。"
      );
      setIsLoading(false);
      return;
    }

    // Mock Login - in real app, call API here
    setTimeout(() => {
      setIsLoading(false);
      router.push("/"); 
    }, 1500);
  };

  const handleDiscordLogin = () => {
    const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    // Ensure protocol is present. If missing, assume https unless localhost
    const withProtocol = RAW_API_URL.match(/^https?:\/\//) 
      ? RAW_API_URL 
      : RAW_API_URL.includes('localhost') 
        ? `http://${RAW_API_URL}` 
        : `https://${RAW_API_URL}`;

    const apiUrl = withProtocol.endsWith('/api') 
      ? withProtocol 
      : `${withProtocol.replace(/\/$/, '')}/api`;
    window.location.href = `${apiUrl}/oauth2/discord/login`;
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#050505] text-white overflow-hidden">
        
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center h-full overflow-hidden">
         <div className="absolute inset-0 z-0">
            <Image 
              src="/images/login-visual.jpg" 
              alt="Gamers Login Visual" 
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-[#050505]"></div>
            <div className="absolute inset-0 bg-[#050505]/20 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 p-12 w-full max-w-2xl text-center lg:text-left">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
            >
               <h1 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter drop-shadow-[0_0_25px_rgba(0,243,255,0.6)]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-600">
                     かけがえのない
                  </span><br />
                  <span className="text-white">思い出を。</span>
               </h1>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
               className="space-y-6 flex flex-col items-center lg:items-start"
            >
               <p className="text-lg lg:text-2xl font-bold text-gray-200 tracking-wide border-l-4 border-neon-purple pl-6 py-2">
                  共に過ごした日々を<br/>忘れずに。
               </p>
               
               <div className="pt-8 flex gap-4">
                  <div className="w-16 h-1 bg-neon-cyan/50 rounded-full shadow-[0_0_10px_#00f3ff]"></div>
                  <div className="w-8 h-1 bg-neon-purple/50 rounded-full shadow-[0_0_10px_#b23aff]"></div>
                  <div className="w-4 h-1 bg-white/50 rounded-full"></div>
               </div>
            </motion.div>
         </div>

         <div className="absolute bottom-10 left-10 opacity-30 pointer-events-none hidden lg:block">
            <div className="text-[10px] font-mono text-neon-cyan space-y-1">
               <p>SYS.STATUS: ONLINE</p>
               <p>LOC: NEO-TOKYO SERVERS</p>
               <p>SECURE CONN: ESTABLISHED</p>
            </div>
         </div>
      </div>
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 lg:p-12 bg-[#050505] h-full overflow-y-auto">
          {/* Animated Background Blobs for Right Side */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
             <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow delay-1000"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10 flex flex-col justify-center min-h-0" // Reduced max-w
          >
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
               <div className="inline-block mb-4">
                  <Link href="/" className="relative block opacity-50 hover:opacity-100 hover:scale-110 duration-300 transition-all">
                    <Image 
                        src="/images/logo-white.png" 
                        alt="GAMERS" 
                        width={120} 
                        height={40} 
                        className="h-16 w-auto object-contain"
                    />
                  </Link>
               </div>
               <h2 className="text-2xl lg:text-4xl font-black text-white mb-2 tracking-tighter">Welcome Back</h2>
               <p className="text-sm lg:text-base text-gray-400 leading-relaxed">GAMERSアカウントでログインして、<br />あなたの伝説を再開しましょう。</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4"> 
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neon-cyan uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan/70 focus:ring-1 focus:ring-neon-cyan/70 transition-all shadow-inner"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neon-cyan uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan/70 focus:ring-1 focus:ring-neon-cyan/70 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-start gap-2 text-red-400 text-xs lg:text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                >
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-purple to-indigo-600 hover:from-neon-purple/90 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(178,58,255,0.4)] hover:shadow-[0_0_35px_rgba(178,58,255,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    ログイン <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 lg:my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050505] px-4 text-gray-500 tracking-widest">OR</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleDiscordLogin}
                    className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-[#5865F2]/40 hover:-translate-y-0.5 flex items-center justify-center gap-3 group border border-[#5865F2]/50 text-sm lg:text-base"
                >
                    <svg width="20" height="20" viewBox="0 0 127 96" className="w-5 h-5 fill-current transition-transform group-hover:scale-110">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-24.43-6.68-47.53-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.25-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    Discordでログイン
                </button>

                <div className="flex items-center justify-center mt-1">
                    <p className="text-gray-500 text-xs lg:text-sm">アカウントをお持ちでないですか？</p>
                    <Link href="/signup" className="ml-3 text-neon-cyan hover:text-white font-bold text-xs lg:text-sm border-b border-neon-cyan/30 hover:border-white transition-all">
                        新規登録
                    </Link>
                </div>
            </div>

          </motion.div>
      </div>
    </div>
  );
}
