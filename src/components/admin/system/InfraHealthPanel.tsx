import { InfraStatusCard } from "./InfraStatusCard";

export function InfraHealthPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
         <InfraStatusCard 
            title="Go API Server"
            type="api"
            status="stable"
            metrics={[
                { label: "Latency", value: "24", unit: "ms" },
                { label: "Error Rate", value: "0.02", unit: "%" },
            ]}
         />
         <InfraStatusCard 
            title="RabbitMQ Cluster"
            type="mq"
            status="warning"
            metrics={[
                { label: "Queue Depth", value: "1,240", unit: "msg" },
                { label: "Consumer Ack", value: "850", unit: "/s" },
            ]}
         />
         <InfraStatusCard 
            title="Discord Bot Shards"
            type="bot"
            status="stable"
            metrics={[
                { label: "Online Shards", value: "12", unit: "/ 12" },
                { label: "Gateway Ping", value: "45", unit: "ms" },
            ]}
         />
         <InfraStatusCard 
            title="PostgreSQL Primary"
            type="db"
            status="stable"
            metrics={[
                { label: "Active Conn", value: "84", unit: "/ 100" },
                { label: "Replica Lag", value: "0", unit: "ms" },
            ]}
         />
    </div>
  );
}
