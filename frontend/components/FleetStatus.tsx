import { Activity, Battery, AlertTriangle, Zap } from "lucide-react";

export default function FleetStatus({ robots }: { robots: any[] }) {
  const activeCount = robots.filter(r => r.status?.state === "moving").length;
  const chargingCount = robots.filter(r => r.status?.state === "charging").length;
  const lowBatteryCount = robots.filter(r => r.system?.battery_percent < 20).length;

  const stats = [
    { 
      label: "Total", 
      value: robots.length, 
      icon: Activity, 
      gradient: "from-cyan-500 to-blue-500",
    },
    { 
      label: "Active", 
      value: activeCount, 
      icon: Zap, 
      gradient: "from-green-500 to-emerald-500",
    },
    { 
      label: "Charging", 
      value: chargingCount, 
      icon: Battery, 
      gradient: "from-yellow-500 to-orange-500",
    },
    { 
      label: "Alerts", 
      value: lowBatteryCount, 
      icon: AlertTriangle, 
      gradient: "from-red-500 to-pink-500",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="glass rounded-2xl p-5 smooth-transition hover:scale-[1.02] hover:border-cyan-500/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm font-medium uppercase tracking-wide">
              {stat.label}
            </span>
            <div className={`bg-gradient-to-br ${stat.gradient} p-2 rounded-lg`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-4xl font-black">
            <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
