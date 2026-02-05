"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search, Bell, Menu, LogOut, User, Settings, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { cn } from "@/lib/utils";
import { UserResponse, MyUserResponse } from "@/types/api";
import { Koulen } from "next/font/google";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

// ... (existing imports)

export default function Header() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState<MyUserResponse | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset image error state when user/avatar changes
  useEffect(() => {
    setImgError(false);
  }, [user?.avatar]);

  const avatarUrl = useMemo(() => {
    if (!user?.avatar) return null;
    try {
    if (!user?.avatar) return null;
    if (user.avatar.startsWith('http') || user.avatar.startsWith('/')) {
        return user.avatar;
    }
    // Assume it's a Discord avatar hash
    return `https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.png`;
    } catch (e) {
        console.error("Failed to parse avatar URL", e);
    }
    return user.avatar;
  }, [user]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const userData = await authService.getMe();
        console.log(userData);
        if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("[Header] Session invalid or failed to fetch user");
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setIsDropdownOpen(false);
      router.push("/login");
  };

  const profileContainerRef = useRef<HTMLDivElement>(null);
  const languageContainerRef = useRef<HTMLDivElement>(null);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Profile Dropdown
      if (isDropdownOpen && profileContainerRef.current && !profileContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Language Dropdown
      if (isLanguageOpen && languageContainerRef.current && !languageContainerRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isLanguageOpen]);

  useGSAP(() => {
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

  useGSAP(() => {
    if (isLanguageOpen) {
        gsap.fromTo(languageRef.current,
            { y: -10, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "power2.out", display: "block" }
        );
    } else {
        gsap.to(languageRef.current,
            { y: -10, opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in", display: "none" }
        );
    }
  }, [isLanguageOpen]);

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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  const LANGUAGES = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <header 
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-colors duration-300 border-b border-transparent"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between transition-all duration-300"> {/* Added transition-all to container if needed, but keeping layout stable */}
        
        <div className="flex items-center gap-4">
            <Link href="/" className={cn("text-3xl tracking-wider text-white hover:opacity-80 transition-opacity", koulen.className)}>
                GAMERS
            </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/contests" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                <Trophy size={16} />
                <span>{t('navbar.contests')}</span>
            </Link>
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative group transition-all duration-300 focus-within:max-w-[26rem] focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] rounded-full">
            <Search className="absolute left-3 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder={t('navbar.search')}
                maxLength={64}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        router.push(`/contests?search=${encodeURIComponent(target.value)}`);
                    }
                }}
                className="w-full bg-secondary/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
        </div>

        <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={languageContainerRef}>
                <button 
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white"
                >
                    <Globe size={20} />
                </button>
                <div 
                    ref={languageRef}
                    className="absolute right-0 top-full mt-2 w-32 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl p-1 hidden origin-top-right overflow-hidden z-50"
                >
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2",
                                i18n.language === lang.code 
                                    ? "bg-[#5865F2] text-white" 
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoggedIn && user ? (
                <>
                    <NotificationDropdown 
                        isOpen={isNotificationOpen} 
                        setIsOpen={setIsNotificationOpen} 
                        isLoggedIn={isLoggedIn}
                    />
                    
                    <div className="relative" ref={profileContainerRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow"
                        >
                            <div className="w-full h-full rounded-full bg-black/50 overflow-hidden flex items-center justify-center backdrop-blur-sm">
                                {avatarUrl && !imgError ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt={user.username} 
                                        className="w-full h-full object-cover" 
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span className="text-xs font-bold text-white">{user.username.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                        </button>

                        <div 
                            ref={dropdownRef}
                            className="absolute right-0 top-full mt-2 w-56 bg-[#0f172a] border border-cyan-500/30 rounded-xl shadow-2xl p-2 hidden origin-top-right overflow-hidden"
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                                <p className="text-sm font-bold text-white">{user.username}#{user.tag}</p>
                            </div>
                            
                            <DropdownItem icon={User} label={t('navbar.myPage')} onClick={() => { setIsDropdownOpen(false); router.push("/my"); }} />
                            <DropdownItem icon={Trophy} label={t('navbar.createContest')} onClick={() => { setIsDropdownOpen(false); router.push("/contests/create"); }} />
                            <DropdownItem icon={FileText} label={t('navbar.report')} onClick={() => { setIsDropdownOpen(false); router.push("/report"); }} />
                            <DropdownItem icon={Settings} label={t('navbar.settings')} />
                            <div className="h-px bg-white/5 my-1" />
                            <DropdownItem icon={LogOut} label={t('navbar.logout')} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout} />
                        </div>
                    </div>
                </>
            ) : (
                <Link 
                    href="/login"
                    className="px-5 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-[#5865F2]/25"
                >
                    {t('navbar.login')}
                </Link>
            )}
            
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
