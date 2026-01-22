"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { GlobalControlBar } from "@/components/admin/GlobalControlBar";
import { ParticipantTable } from "@/components/admin/ParticipantTable";
import { LiveMatchController } from "@/components/admin/LiveMatchController";
import { SystemLog } from "@/components/admin/SystemLog";
import { Koulen } from "next/font/google"; // Removed Koulen import logic from Header copy-paste, assuming standard layout usage

const MOCK_PARTICIPANTS = [
    { id: "1", discordId: "Faker#0001", username: "Faker", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faker", status: "Online", team: "T1" },
    { id: "2", discordId: "Chovy#0002", username: "Chovy", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chovy", status: "Playing", team: "GEN.G" },
    { id: "3", discordId: "ShowMaker#0003", username: "ShowMaker", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShowMaker", status: "Offline", team: "DK" },
    { id: "4", discordId: "Zeus#0004", username: "Zeus", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeus", status: "Online", team: "T1" },
    { id: "5", discordId: "Keria#0005", username: "Keria", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Keria", status: "Warning", team: "T1" },
    { id: "6", discordId: "Gumayusi#0006", username: "Gumayusi", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gumayusi", status: "Banned", team: "None" },
    { id: "7", discordId: "Oner#0007", username: "Oner", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oner", status: "Online", team: "T1" },
    { id: "8", discordId: "Peanut#0008", username: "Peanut", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peanut", status: "Playing", team: "GEN.G" },
] as const; // Cast as specific type matching props eventually

export default function AdminManagePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white font-sans selection:bg-neon-cyan/30">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
            {/* Admin Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-neutral-900/80 backdrop-blur-md z-20">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <span className="text-neon-cyan">///</span> MISSION CONTROL
                    </h1>
                    <p className="text-xs text-neutral-500 font-mono">Contest ID: {params.id}</p>
                </div>
                <div className="flex items-center gap-3">
                     <div className="text-right hidden md:block">
                        <div className="text-xs text-neutral-500">Administrator</div>
                        <div className="text-sm font-bold">Sunwoo</div>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-xs font-bold">SW</span>
                        </div>
                     </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 grid-rows-[auto_1fr_1fr] md:grid-rows-[auto_1fr_250px] gap-4 md:gap-6">
                
                {/* 1. Global Control Bar (Top - Full Width) */}
                <div className="col-span-1 md:col-span-12">
                    <GlobalControlBar />
                </div>

                {/* 2. Participant Management (Mid-Left - 8 cols) */}
                <div className="col-span-1 md:col-span-8 h-[400px] md:h-auto min-h-0">
                    <ParticipantTable data={MOCK_PARTICIPANTS as any} />
                </div>

                {/* 3. Live Match Controller (Mid-Right - 4 cols, spans down to logs if needed, but let's stack logs below) */}
                {/* Actually user requested System Log at Bottom. 
                    Let's make ParticipantTable and MatchController share the middle height. 
                */}
                <div className="col-span-1 md:col-span-4 h-[300px] md:h-auto min-h-0">
                    <LiveMatchController />
                </div>

                {/* 4. System Log (Bottom - Full Width) */}
                <div className="col-span-1 md:col-span-12 min-h-[200px]">
                    <SystemLog />
                </div>

            </div>
        </main>
    </div>
  );
}
