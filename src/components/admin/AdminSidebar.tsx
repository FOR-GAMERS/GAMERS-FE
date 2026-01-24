import { ChevronLeft, LayoutDashboard, Users, Trophy, Settings, LogOut, Image } from "lucide-react";
import { Koulen } from "next/font/google"; // Import Koulen
import Link from "next/link";
import { usePathname } from "next/navigation";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

interface AdminSidebarProps {
    mode?: "contest" | "system";
}

export function AdminSidebar({ mode = "contest" }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <aside className={`w-16 md:w-64 bg-black border-r border-white/10 flex flex-col sticky transition-all ${mode === 'system' ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]'}`}>
      <div className="p-4 h-16 flex items-center border-b border-white/10">
        {mode === "system" ? (
             <Link href="/admin/dashboard" className={`text-2xl tracking-wider text-white hover:opacity-80 transition-opacity ${koulen.className}`}>
                GAMERS
             </Link>
        ) : (
            <Link href="/contests" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-bold hidden md:block">Back</span>
            </Link>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" href="/admin/dashboard" active={isActive('/admin/dashboard')} />
        <NavItem icon={Users} label="Users" href="/admin/users" active={isActive('/admin/users')} />
        <NavItem icon={Trophy} label="Contests" href="/admin/contests-manage" active={isActive('/admin/contests-manage')} />
        <NavItem icon={Image} label="Banner" href="/admin/banners" active={isActive('/admin/banners')} />
        <NavItem icon={Settings} label="Settings" href="/admin/settings" active={isActive('/admin/settings')} />
      </nav>

      <div className="p-2 border-t border-white/10">
        <NavItem icon={LogOut} label="Exit Admin" href="/" variant="danger" />
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, href, active, variant = "default" }: { icon: any, label: string, href: string, active?: boolean, variant?: "default" | "danger" }) {
    const baseClasses = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group";
    const variantClasses = variant === "danger" 
        ? "text-red-500 hover:bg-red-500/10" 
        : active 
            ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" 
            : "text-neutral-400 hover:text-white hover:bg-white/5";

    return (
        <Link href={href} className={`${baseClasses} ${variantClasses}`}>
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden md:block">{label}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
            )}
        </Link>
    )
}
