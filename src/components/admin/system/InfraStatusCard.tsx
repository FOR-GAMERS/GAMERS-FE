"use client";

import { Activity, Server, Database, Share2, AlertCircle, CheckCircle, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line } from "recharts";

/* 
  Mock Sparkline Data generator or pass props 
*/
const generateSparklineData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        value: 50 + Math.random() * 30 - 15
    }));
};

interface InfraStatusCardProps {
  title: string;
  type: "api" | "mq" | "db" | "bot";
  status: "stable" | "warning" | "critical";
  metrics: {
      label: string;
      value: string;
      unit?: string;
  }[];
}

export function InfraStatusCard({ title, type, status, metrics }: InfraStatusCardProps) {
  const statusColor = {
      stable: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5",
      warning: "text-amber-500 border-amber-500/30 bg-amber-500/5",
      critical: "text-rose-600 border-rose-600/30 bg-rose-600/5"
  };
  
  const iconMap = {
      api: Server,
      mq: Share2,
      db: Database,
      bot: Wifi
  };

  const Icon = iconMap[type];

  return (
    <div className={cn(
        "relative rounded-xl border p-4 flex flex-col gap-4 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]",
        statusColor[status].replace("text-", "border-").replace("bg-", "hover:bg-") // Hacky reuse of color map for border
    )}>
        {/* Background Grid Pattern (Cyberpunk feel) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-lg bg-black/40 border", statusColor[status].split(' ')[1])}>
                    <Icon className={cn("w-5 h-5", statusColor[status].split(' ')[0])} />
                </div>
                <h3 className="font-bold text-neutral-300 tracking-wide uppercase text-sm">{title}</h3>
            </div>
            <div className="flex items-center gap-1.5">
                {status === 'stable' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {status === 'warning' && <Activity className="w-4 h-4 text-amber-500 animate-pulse" />}
                {status === 'critical' && <AlertCircle className="w-4 h-4 text-rose-600 animate-bounce" />}
                <span className={cn("text-xs font-bold uppercase", statusColor[status].split(' ')[0])}>{status}</span>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 z-10">
            {metrics.map((metric, idx) => (
                <div key={idx} className="bg-black/40 rounded p-2 border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase font-bold mb-0.5">{metric.label}</div>
                    <div className="text-xl font-mono font-bold text-neutral-200 flex items-end gap-1 leading-none">
                        {metric.value}
                        {metric.unit && <span className="text-xs text-neutral-500 mb-0.5 font-sans">{metric.unit}</span>}
                    </div>
                </div>
            ))}
        </div>

        {/* Mini Sparkline Visualization (Decorative for now to show 'Live') */}
        <div className="h-12 -mx-4 -mb-4 mt-auto opacity-30 z-0">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateSparklineData()}>
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={status === 'stable' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#e11d48'} 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={true}
                    />
                </LineChart>
             </ResponsiveContainer>
        </div>
    </div>
  );
}
