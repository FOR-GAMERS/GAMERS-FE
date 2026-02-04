"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Gamepad2 } from "lucide-react";
import { authService } from "@/services/auth-service";
import { useTranslation } from "react-i18next";

export default function LoginSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "not_found">("loading");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      // Small delay to ensure cookies are ready or just visual pacing
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        await authService.getMe();
        setStatus("success");
        setTimeout(() => {
          router.push("/contests");
        }, 800);
      } catch (error: any) {
        console.error("Auth verification failed", error);
        setDebugInfo(`Error: ${error.message || "Session not found"}\nStatus: ${error.status || "401"}`);
        setStatus("error");
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md w-full">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="mb-8"
        >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10 border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.2)] backdrop-blur-sm">
                {status === "loading" && <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />}
                {status === "success" && <CheckCircle2 className="w-10 h-10 text-green-400" />}
                {status === "error" && <Gamepad2 className="w-10 h-10 text-red-400" />}
            </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {status === "loading" && (
                <>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {t('loginCheck.verifyingTitle')}
                    </h1>
                    <p className="text-gray-500">
                        {t('loginCheck.verifyingDesc')}
                    </p>
                </>
            )}
            
            {status === "success" && (
                <>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500">
                        {t('loginCheck.successTitle')}
                    </h1>
                    <p className="text-gray-400">
                        {t('loginCheck.successDesc')}
                    </p>
                </>
            )}

            {status === "not_found" && (
                <>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter text-yellow-500">
                        {t('loginCheck.notFoundTitle')}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {errorMessage}<br/>
                        {t('loginCheck.notFoundDesc')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => router.push("/login")}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
                        >
                            {t('loginCheck.btnLogin')}
                        </button>
                        <button 
                            onClick={() => router.push("/signup")}
                            className="px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 text-neon-cyan rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                        >
                            {t('loginCheck.btnSignup')}
                        </button>
                    </div>
                </>
            )}

            {status === "error" && (
                <>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter text-red-500">
                        {t('loginCheck.errorTitle')}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {errorMessage}<br/>
                        {t('loginCheck.errorDesc')}
                    </p>
                    <button 
                        onClick={() => router.push("/login")}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    >
                        {t('loginCheck.btnLogin')}
                    </button>
                    {/* DEBUG PANEL */}
                    <div className="mt-8 p-4 bg-black/50 rounded-lg text-left w-full overflow-x-auto border border-red-500/30">
                        <p className="text-xs font-bold text-red-400 mb-2">{t('loginCheck.debugInfo')}</p>
                        <pre className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap">
                            {debugInfo}
                        </pre>
                    </div>
                </>
            )}
        </motion.div>
      </div>

       {/* Status text decoration */}
       <div className="absolute bottom-10 opacity-30 font-mono text-xs text-neon-cyan tracking-widest pointer-events-none">
            {status === "loading" && "SYSTEM.AUTH_CHECK // PROCESSING"}
            {status === "success" && "SYSTEM.ACCESS // GRANTED"}
            {status === "error" && "SYSTEM.ERR // UNAUTHORIZED"}
       </div>
    </div>
  );
}
