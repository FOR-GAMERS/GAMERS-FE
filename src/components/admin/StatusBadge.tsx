import { cn } from "@/lib/utils";

type StatusType = "Online" | "Offline" | "Playing" | "Banned" | "Warning";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    Online: "bg-green-500/10 text-green-500 border-green-500/20",
    Offline: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    Playing: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
    Banned: "bg-red-500/10 text-red-500 border-red-500/20",
    Warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div
      className={cn(
        "px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1.5 w-fit",
        styles[status],
        className
      )}
    >
      <div 
        className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "Online" && "bg-green-500 animate-pulse",
            status === "Offline" && "bg-neutral-500",
            status === "Playing" && "bg-neon-cyan animate-pulse",
            status === "Banned" && "bg-red-500",
            status === "Warning" && "bg-yellow-500",
        )} 
      />
      {status}
    </div>
  );
}
