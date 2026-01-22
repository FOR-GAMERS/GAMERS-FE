import { Terminal, AlertCircle, Info, CheckCircle } from "lucide-react";

export function SystemLog() {
  const logs = [
    { id: 1, type: "error", message: "Failed to sync match result for Match #41", time: "10:42 PM" },
    { id: 2, type: "info", message: "User 'Faker' connected", time: "10:41 PM" },
    { id: 3, type: "success", message: "Bracket generated successfully", time: "10:40 PM" },
    { id: 4, type: "warning", message: "High latency detected on Node KR-1", time: "10:38 PM" },
    { id: 5, type: "info", message: "Contest status changed to LIVE", time: "10:30 PM" },
  ];

  const getIcon = (type: string) => {
      switch(type) {
          case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
          case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />;
          case 'success': return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
          default: return <Info className="w-3.5 h-3.5 text-blue-500" />;
      }
  };

  return (
    <div className="bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col h-full font-mono text-xs">
         <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-white/5 ">
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 font-bold uppercase tracking-wider">System Log</span>
         </div>
         <div className="flex-1 overflow-auto p-2 space-y-1">
             {logs.map(log => (
                 <div key={log.id} className="flex gap-2 hover:bg-white/5 p-1 rounded transition-colors group cursor-default">
                     <span className="text-neutral-600 shrink-0">[{log.time}]</span>
                     <div className="mt-0.5">{getIcon(log.type)}</div>
                     <span className={`break-all ${log.type === 'error' ? 'text-red-400 font-bold' : log.type === 'warning' ? 'text-yellow-400' : 'text-neutral-300'}`}>
                         {log.type === 'error' && <span className="text-red-500 mr-1">[ERR]</span>}
                         {log.message}
                     </span>
                 </div>
             ))}
             <div className="flex gap-2 p-1 text-neon-cyan animate-pulse">
                 <span className="text-neutral-600">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                 <span>_</span>
             </div>
         </div>
    </div>
  );
}
