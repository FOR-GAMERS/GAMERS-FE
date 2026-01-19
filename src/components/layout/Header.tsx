"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search, Bell, Menu, LogOut, User, Settings, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Demo State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // GSAP: Animate bottom border on scroll
  useGSAP(() => {
    // Initial state: border is there but transparent or width 0? 
    // Requirement: "neon-cyan color border that animates in"
    
    gsap.fromTo(headerRef.current, 
      { borderBottomColor: "transparent", borderBottomWidth: "1px" }, 
      {
        borderBottomColor: "#06b6d4", // Cyan-500 equivalent
        scrollTrigger: {
          trigger: "body",
          start: "10px top",
          end: "20px top",
          toggleActions: "play none none reverse",
          scrub: 0.5
        }
      }
    );
  }, { scope: headerRef });

  // Toggle dropdown animation
  useGSAP(() => {
    if (isDropdownOpen) {
        gsap.fromTo(dropdownRef.current,
            { y: -10, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "power2.out", display: "block" }
        );
    } else {
        gsap.to(dropdownRef.current,
            { y: -10, opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in", display: "none" }
        );
    }
  }, [isDropdownOpen]);

  return (
    <header 
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-colors duration-300 border-b border-transparent"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => setIsLoggedIn(!isLoggedIn)}>
                <img src="/logo.png" alt="GAMERS Logo" className="h-8 w-auto" loading="lazy" />
                {/* Debug Toggle */}
                <span className="text-[10px] bg-white/10 px-1 rounded text-muted-foreground font-normal border border-white/10">
                    {isLoggedIn ? "ユーザー" : "ゲスト"}
                </span>
            </div>
        </div>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/contests" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                <Trophy size={16} />
                <span>大会</span>
            </Link>
        </nav>

        {/* SEARCH BAR */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative group transition-all duration-300 focus-within:max-w-md focus-within:shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-full">
            <Search className="absolute left-3 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder="検索..." 
                maxLength={64}
                className="w-full bg-secondary/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
            {isLoggedIn ? (
                <>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow"
                        >
                            <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-xs font-bold text-white">SW</span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div 
                            ref={dropdownRef}
                            className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a] border border-cyan-500/30 rounded-xl shadow-2xl p-2 hidden origin-top-right overflow-hidden"
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                                <p className="text-sm font-bold text-white">Sunwoo</p>
                                <p className="text-xs text-muted-foreground">プレミアムメンバー</p>
                            </div>
                            
                            <DropdownItem icon={User} label="マイページ" />
                            <DropdownItem icon={FileText} label="レポート" />
                            <DropdownItem icon={Settings} label="設定" />
                            <div className="h-px bg-white/5 my-1" />
                            <DropdownItem icon={LogOut} label="ログアウト" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => setIsLoggedIn(false)} />
                        </div>
                    </div>
                </>
            ) : (
                <button 
                    onClick={() => {
                        // Check for tokens
                        if (checkAuth()) {
                            setIsLoggedIn(true);
                        } else {
                            // Redirect to login page
                            router.push("/login");
                        }
                    }}
                    className="px-5 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-[#5865F2]/25"
                >
                    Discordでログイン
                </button>
            )}
            
            {/* Mobile Menu Trigger (Visual Only) */}
            <button className="md:hidden p-2 text-white">
                <Menu />
            </button>
        </div>

      </div>
    </header>
  );
}

function DropdownItem({ icon: Icon, label, className, onClick }: { icon: any, label: string, className?: string, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left",
                className
            )}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    )
}
