"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { InfraHealthPanel } from "@/components/admin/system/InfraHealthPanel";
import { ContestManagementPanel } from "@/components/admin/system/ContestManagementPanel";
import { UserManagementView } from "@/components/admin/system/UserManagementView";
import { Globe, Users, Server, Activity, ArrowRight } from "lucide-react";

export default function SystemDashboardPage() {
  const [showUserManagement, setShowUserManagement] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        <AdminSidebar mode="system" />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black pointer-events-none" />
            
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-emerald-500 animate-pulse" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            SYSTEM MONITOR <span className="text-emerald-500 text-xs align-top">LIVE</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs text-neutral-500">
                     <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>UPTIME: 45d 12h 30m</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        <span>v2.4.0-stable</span>
                     </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10 space-y-6">
                
                {/* 1. Infrastructure Health Panel (Top) */}
                <section>
                    <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Infrastructure Health
                    </h2>
                    <InfraHealthPanel />
                </section>

                {/* 2. Management Section (Contest & User) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[400px]">
                    
                    {/* Contest Management (Left) */}
                    <div className="col-span-1 md:col-span-8 h-full">
                        <ContestManagementPanel />
                    </div>

                    {/* Management Actions (Right) */}
                    <div className="col-span-1 md:col-span-4 space-y-4 font-sans">
                        {/* User Management Card */}
                        <div 
                            onClick={() => setShowUserManagement(true)}
                            className="bg-neutral-900/30 border border-white/5 hover:border-neon-cyan/50 hover:bg-neutral-900/50 rounded-xl p-6 h-1/2 cursor-pointer group transition-all relative overflow-hidden"
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="w-24 h-24" />
                             </div>
                             <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">User Management</h3>
                                    <p className="text-sm text-neutral-400">View, edit, and ban users.</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-neon-cyan opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                    OPEN PANEL <ArrowRight className="w-4 h-4" />
                                </div>
                             </div>
                        </div>

                        {/* Pending Requests Card (Placeholder) */}
                        <div className="bg-neutral-900/30 border border-white/5 rounded-xl p-6 h-1/2 flex flex-col justify-between opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                             <div>
                                 <h3 className="text-lg font-bold text-white mb-1">Organization Requests</h3>
                                 <p className="text-sm text-neutral-400">0 pending requests.</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 3. System Logs (Bottom) */}
                <section className="flex-1 min-h-[250px] bg-black border border-white/10 rounded-xl overflow-hidden font-mono text-xs flex flex-col">
                    <div className="p-2 border-b border-white/10 bg-white/5 flex items-center justify-between">
                         <span className="font-bold text-neutral-400">SYSTEM LOGS STREAM</span>
                         <div className="flex gap-2">
                             <span className="text-emerald-500">INFO</span>
                             <span className="text-amber-500">WARN</span>
                             <span className="text-rose-600">ERR</span>
                         </div>
                    </div>
                    <div className="p-4 space-y-1 text-neutral-400 overflow-y-auto">
                        <div className="opacity-50">Initializing log stream connection...</div>
                        <div><span className="text-emerald-500">[INFO]</span> Connected to log aggregation service (ws://logs.gamers.internal)</div>
                        <div><span className="text-emerald-500">[INFO]</span> Consumer group 'admin-dashboard' joined</div>
                        <div><span className="text-amber-500">[WARN]</span> High latency detected on Queue 'match-processing' (120ms)</div>
                        <div className="animate-pulse text-neon-cyan">_</div>
                    </div>
                </section>
            </div>

            {/* Modals */}
            {showUserManagement && <UserManagementView onClose={() => setShowUserManagement(false)} />}
        </main>
    </div>
  );
}
