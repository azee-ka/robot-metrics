"use client";

import { Eye, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";

interface AnomalyDetectionProps {
  robots: any[];
}

export default function AnomalyDetection({ robots }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);

  useEffect(() => {
    const detected: any[] = [];

    robots.forEach(robot => {
      if (robot.system?.cpu_percent > 80) {
        detected.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          type: "cpu_spike",
          severity: "high",
          metric: "CPU Usage",
          current_value: robot.system.cpu_percent.toFixed(1),
          normal_range: "20-60%",
          deviation: ((robot.system.cpu_percent - 40) / 40 * 100).toFixed(0),
          detected_at: new Date(),
          description: "CPU usage significantly higher than baseline",
          impact: "May indicate excessive workload or system stress",
          recommendation: "Review task allocation, check for resource-intensive operations"
        });
      }

      if (robot.network?.latency_ms > 30) {
        detected.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          type: "network_latency",
          severity: "medium",
          metric: "Network Latency",
          current_value: `${robot.network.latency_ms.toFixed(1)}ms`,
          normal_range: "8-15ms",
          deviation: ((robot.network.latency_ms - 12) / 12 * 100).toFixed(0),
          detected_at: new Date(),
          description: "Network latency higher than expected",
          impact: "Could affect real-time communication and coordination",
          recommendation: "Check network infrastructure, verify signal strength"
        });
      }

      if (robot.system?.battery_percent < 30 && robot.status?.state === "moving") {
        detected.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          type: "battery_pattern",
          severity: "high",
          metric: "Battery Behavior",
          current_value: `${robot.system.battery_percent.toFixed(1)}%`,
          normal_range: ">40% while active",
          deviation: ((40 - robot.system.battery_percent) / 40 * 100).toFixed(0),
          detected_at: new Date(),
          description: "Operating with low battery - unusual behavior pattern",
          impact: "Risk of unexpected shutdown during critical task",
          recommendation: "Redirect to charging station immediately"
        });
      }

      const memUsage = robot.system?.memory_percent || 0;
      if (memUsage > 85) {
        detected.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          type: "memory_leak",
          severity: "medium",
          metric: "Memory Usage",
          current_value: `${memUsage.toFixed(1)}%`,
          normal_range: "40-70%",
          deviation: ((memUsage - 55) / 55 * 100).toFixed(0),
          detected_at: new Date(),
          description: "Memory usage trending higher than historical baseline",
          impact: "Potential memory leak or resource accumulation",
          recommendation: "Schedule system restart, investigate memory-intensive processes"
        });
      }
    });

    setAnomalies(detected);
  }, [robots]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "critical": return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/50" };
      case "high": return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/50" };
      case "medium": return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50" };
      case "low": return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/50" };
      default: return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/50" };
    }
  };

  const criticalCount = anomalies.filter(a => a.severity === "critical").length;
  const highCount = anomalies.filter(a => a.severity === "high").length;
  const mediumCount = anomalies.filter(a => a.severity === "medium").length;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Anomaly Detection</h2>
            <p className="text-gray-400">Real-time pattern recognition from fleet metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-xl p-4 border-2 border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Critical</p>
                <p className="text-3xl font-black text-red-400">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="glass rounded-xl p-4 border-2 border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">High Priority</p>
                <p className="text-3xl font-black text-orange-400">{highCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <div className="glass rounded-xl p-4 border-2 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Medium Priority</p>
                <p className="text-3xl font-black text-yellow-400">{mediumCount}</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="glass rounded-2xl p-20 text-center">
          <Eye className="w-16 h-16 text-green-500/30 mx-auto mb-4" />
          <p className="text-2xl text-white mb-2">No Anomalies Detected</p>
          <p className="text-gray-400">All fleet metrics within normal parameters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-white font-bold">Detected Anomalies ({anomalies.length})</h3>
            {anomalies.map((anomaly, idx) => {
              const colors = getSeverityColor(anomaly.severity);
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnomaly(anomaly)}
                  className={`w-full glass rounded-xl p-4 text-left smooth-transition border-2 ${
                    selectedAnomaly === anomaly ? colors.border : "border-transparent"
                  } hover:${colors.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-bold">{anomaly.robot_id}</p>
                      <p className="text-gray-400 text-xs">{anomaly.warehouse_id}</p>
                    </div>
                    <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-lg text-xs font-bold uppercase`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">{anomaly.metric}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Current: </span>
                      <span className={colors.text}>{anomaly.current_value}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Normal: </span>
                      <span className="text-gray-400">{anomaly.normal_range}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deviation: </span>
                      <span className={colors.text}>+{anomaly.deviation}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            {selectedAnomaly ? (
              <div className="glass rounded-2xl p-6 sticky top-6">
                <h3 className="text-white font-bold text-xl mb-4">Anomaly Details</h3>
                
                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-sm mb-1">Robot</p>
                  <p className="text-white font-bold text-lg">{selectedAnomaly.robot_id}</p>
                  <p className="text-gray-400 text-sm">{selectedAnomaly.warehouse_id}</p>
                </div>

                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-sm mb-2">Description</p>
                  <p className="text-white">{selectedAnomaly.description}</p>
                </div>

                <div className="glass rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-sm mb-2">Impact Assessment</p>
                  <p className="text-yellow-400">{selectedAnomaly.impact}</p>
                </div>

                <div className="glass rounded-xl p-4 mb-4 border border-cyan-500/30">
                  <p className="text-gray-400 text-sm mb-2">Recommended Action</p>
                  <p className="text-cyan-400">{selectedAnomaly.recommendation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 rounded-xl font-bold text-white hover:scale-105 smooth-transition">
                    Take Action
                  </button>
                  <button className="glass px-4 py-3 rounded-xl font-bold text-white hover:bg-white/5 smooth-transition">
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-20 text-center">
                <Eye className="w-12 h-12 text-gray-500/30 mx-auto mb-3" />
                <p className="text-gray-400">Select an anomaly to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}