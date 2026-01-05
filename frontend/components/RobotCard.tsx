"use client";

import { Cpu, HardDrive, Battery, Wifi, MapPin, Zap } from "lucide-react";
import { memo } from "react";

function RobotCard({ robot }: { robot: any }) {
  const batteryColor =
    robot.system?.battery_percent > 60 ? "from-cyan-500 to-blue-500" :
    robot.system?.battery_percent > 20 ? "from-yellow-500 to-orange-500" : "from-red-500 to-pink-500";

  const statusConfig = {
    moving: { color: "from-green-500 to-emerald-500", label: "ACTIVE" },
    charging: { color: "from-yellow-500 to-orange-500", label: "CHARGING" },
    idle: { color: "from-gray-500 to-gray-600", label: "STANDBY" }
  };

  const status = statusConfig[robot.status?.state as keyof typeof statusConfig] || statusConfig.idle;

  return (
    <div className="glass rounded-2xl p-6 smooth-transition hover:scale-[1.02] hover:border-cyan-500/50">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-2xl font-black text-white">{robot.robot_id}</h3>
          <span className="text-gray-400 text-sm">{robot.warehouse_id}</span>
        </div>
        
        <div className={`bg-gradient-to-r ${status.color} px-4 py-1.5 rounded-lg`}>
          <span className="text-white text-xs font-bold tracking-wider">{status.label}</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: Cpu, label: "CPU", value: `${robot.system?.cpu_percent?.toFixed(1)}%`, gradient: "from-cyan-500 to-blue-500" },
          { icon: HardDrive, label: "Memory", value: `${robot.system?.memory_percent?.toFixed(1)}%`, gradient: "from-purple-500 to-pink-500" },
          { icon: Battery, label: "Battery", value: `${robot.system?.battery_percent?.toFixed(1)}%`, gradient: batteryColor },
          { icon: Wifi, label: "Latency", value: `${robot.network?.latency_ms?.toFixed(1)}ms`, gradient: "from-blue-500 to-cyan-500" },
        ].map((metric) => (
          <div key={metric.label} className="flex items-center justify-between glass rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${metric.gradient} p-1.5 rounded-lg`}>
                <metric.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-gray-300 text-sm font-medium">{metric.label}</span>
            </div>
            <span className={`bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent font-bold font-mono text-sm`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 glass rounded-xl p-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span className="text-gray-400 text-xs">Position:</span>
        <span className="text-cyan-400 font-mono text-sm font-bold">
          X:{robot.position?.x?.toFixed(1)} Y:{robot.position?.y?.toFixed(1)}
        </span>
      </div>

      {robot.status?.current_task && (
        <div className="mt-4 glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300 text-sm font-medium">{robot.status.current_task}</span>
          </div>
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              style={{ 
                width: `${robot.status.task_progress}%`,
                transition: 'width 1s linear'
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-bold text-cyan-400">{robot.status.task_progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RobotCard, (prev, next) => {
  return JSON.stringify(prev.robot) === JSON.stringify(next.robot);
});
