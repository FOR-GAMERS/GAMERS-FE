import { ChevronLeft, LayoutDashboard, Users, Trophy, Settings, LogOut } from "lucide-react";
import { Koulen } from "next/font/google"; // Import Koulen
import Link from "next/link";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

interface AdminSidebarProps {
    mode?: "contest" | "system";
}

export function AdminSidebar({ mode = "contest" }: AdminSidebarProps) {
  return (
    <aside className="w-16 md:w-64 bg-black border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-4 h-16 flex items-center border-b border-white/10">
        {mode === "system" ? (
             <Link href="/admin/system/dashboard" className={`text-2xl tracking-wider text-white hover:opacity-80 transition-opacity ${koulen.className}`}>
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
        <NavItem icon={LayoutDashboard} label="Dashboard" href="#" active />
        <NavItem icon={Users} label="Participants" href="#" />
        <NavItem icon={Trophy} label="Brackets" href="#" />
        <NavItem icon={Settings} label="Settings" href="#" />
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
        </Link>
    )
}
