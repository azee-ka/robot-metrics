"use client";

import { AlertTriangle, Battery, Wifi, TrendingDown } from "lucide-react";

interface AlertsViewProps {
  robots: any[];
  onRobotClick: (robot: any) => void;
}

export default function AlertsView({ robots, onRobotClick }: AlertsViewProps) {
  const alerts = robots.flatMap(robot => {
    const robotAlerts = [];
    
    if (robot.system?.battery_percent < 20) {
      robotAlerts.push({
        robot_id: robot.robot_id,
        warehouse_id: robot.warehouse_id,
        type: "battery",
        severity: robot.system.battery_percent < 10 ? "critical" : "warning",
        message: `Low battery: ${robot.system.battery_percent.toFixed(1)}%`,
        icon: Battery,
        robot: robot
      });
    }
    
    if (robot.network?.latency_ms > 50) {
      robotAlerts.push({
        robot_id: robot.robot_id,
        warehouse_id: robot.warehouse_id,
        type: "network",
        severity: "warning",
        message: `High latency: ${robot.network.latency_ms.toFixed(1)}ms`,
        icon: Wifi,
        robot: robot
      });
    }
    
    if (robot.system?.cpu_percent > 90) {
      robotAlerts.push({
        robot_id: robot.robot_id,
        warehouse_id: robot.warehouse_id,
        type: "performance",
        severity: "warning",
        message: `High CPU: ${robot.system.cpu_percent.toFixed(1)}%`,
        icon: TrendingDown,
        robot: robot
      });
    }
    
    return robotAlerts;
  });

  const criticalAlerts = alerts.filter(a => a.severity === "critical");
  const warningAlerts = alerts.filter(a => a.severity === "warning");

  return (
    <div className="space-y-4">
      {criticalAlerts.length > 0 && (
        <div className="glass rounded-2xl p-5 border-red-500/50">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Critical Alerts ({criticalAlerts.length})
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert, idx) => (
              <button
                key={idx}
                onClick={() => onRobotClick(alert.robot)}
                className="w-full glass rounded-xl p-4 hover:border-red-500/50 smooth-transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <alert.icon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{alert.robot_id}</p>
                      <p className="text-sm text-gray-400">{alert.warehouse_id}</p>
                      <p className="text-sm text-red-400 mt-1">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-400 font-bold">CRITICAL</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Warnings ({warningAlerts.length})
          </h3>
          <div className="space-y-3">
            {warningAlerts.map((alert, idx) => (
              <button
                key={idx}
                onClick={() => onRobotClick(alert.robot)}
                className="w-full glass rounded-xl p-4 hover:border-yellow-500/50 smooth-transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg">
                      <alert.icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{alert.robot_id}</p>
                      <p className="text-sm text-gray-400">{alert.warehouse_id}</p>
                      <p className="text-sm text-yellow-400 mt-1">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-yellow-400 font-bold">WARNING</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="glass rounded-2xl p-16 text-center">
          <AlertTriangle className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
          <p className="text-xl text-white mb-2">All Systems Operational</p>
          <p className="text-gray-400">No alerts detected</p>
        </div>
      )}
    </div>
  );
}