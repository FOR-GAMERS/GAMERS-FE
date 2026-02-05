"use client";

import { Image, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { bannerService } from "@/services/banner-service";
import { useQuery } from "@tanstack/react-query";

export function BannerManagementPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
        const res = await bannerService.getAdminBanners();
        return res.data;
    }
  });

  const count = data?.banners.length || 0;

  return (
    <div className="bg-neutral-900/30 border border-white/5 hover:border-neon-cyan/50 hover:bg-neutral-900/50 rounded-xl p-6 h-full flex flex-col justify-between group transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Image className="w-24 h-24" />
        </div>
        
        <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors flex items-center gap-2">
                <Image className="w-4 h-4" /> Banners
            </h3>
            <p className="text-sm text-neutral-400">Manage homepage hero banners.</p>
        </div>

        <div className="relative z-10 mt-4">
             {isLoading ? (
                 <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
             ) : (
                <div className="text-3xl font-black text-white font-mono">
                    {count}<span className="text-sm text-neutral-500 font-normal ml-1">/ 5</span>
                </div>
             )}
             <div className="text-xs text-emerald-500 mt-1">Active on Homepage</div>
        </div>

        <Link href="/admin/banners" 
            className="relative z-10 flex items-center gap-2 text-sm font-bold text-neon-cyan opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all mt-auto pt-4"
        >
            MANAGE BANNERS <ArrowRight className="w-4 h-4" />
        </Link>
    </div>
  );
}
