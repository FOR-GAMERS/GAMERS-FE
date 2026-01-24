import { StatusBadge } from "./StatusBadge";
import { Search, MoreVertical, ShieldAlert, Ban, Edit } from "lucide-react";

interface Participant {
  id: string;
  discordId: string;
  username: string;
  avatarUrl: string;
  status: "Online" | "Offline" | "Playing" | "Banned" | "Warning";
  team: string;
}

interface ParticipantTableProps {
  data: Participant[];
}

export function ParticipantTable({ data }: ParticipantTableProps) {
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm">
        <h3 className="font-bold text-white flex items-center gap-2">
            Participants <span className="text-neutral-500 text-sm font-normal">({data.length})</span>
        </h3>
        
        <div className="flex items-center gap-2">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-neon-cyan transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search user..." 
                    className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all w-64 placeholder:text-neutral-600"
                />
            </div>
            <button className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-900 sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-3 font-medium border-b border-white/5">User</th>
                    <th className="px-4 py-3 font-medium border-b border-white/5">Status</th>
                    <th className="px-4 py-3 font-medium border-b border-white/5">Team</th>
                    <th className="px-4 py-3 font-medium border-b border-white/5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden relative">
                                    <img src={user.avatarUrl} alt={user.username} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <div className="font-medium text-white group-hover:text-neon-cyan transition-colors">{user.username}</div>
                                    <div className="text-xs text-neutral-500 font-mono">{user.discordId}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 text-neutral-300">
                            {user.team}
                        </td>
                        <td className="px-4 py-3 text-right">
                             <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded" title="Edit Team">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-neutral-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded" title="Kick">
                                    <ShieldAlert className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded" title="Ban">
                                    <Ban className="w-4 h-4" />
                                </button>
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
