"use client";

import { Beaker, Play, RotateCcw, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";

interface SimulatorProps {
  robots: any[];
}

export default function StrategySimulator({ robots }: SimulatorProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const strategies = [
    {
      id: "aggressive_charging",
      name: "Aggressive Charging Strategy",
      description: "Charge robots immediately when battery drops below 40%",
      params: { battery_threshold: 40, charging_priority: "high" }
    },
    {
      id: "balanced_workload",
      name: "Balanced Workload Distribution",
      description: "Distribute tasks evenly across all available robots",
      params: { distribution: "even", max_tasks_per_robot: 5 }
    },
    {
      id: "zone_optimization",
      name: "Zone-Based Optimization",
      description: "Assign robots to specific zones to minimize travel",
      params: { zones: 3, reassignment_interval: 300 }
    },
    {
      id: "predictive_maintenance",
      name: "Predictive Maintenance Mode",
      description: "Reduce workload on robots showing early failure signs",
      params: { health_threshold: 85, workload_reduction: 30 }
    }
  ];

  const runSimulation = () => {
    setSimulationRunning(true);
    
    setTimeout(() => {
      const results = {
        strategy: selectedStrategy,
        duration: "5 minutes (simulated)",
        metrics: {
          efficiency_gain: Math.random() * 20 + 5,
          energy_saved: Math.random() * 15 + 5,
          task_completion_time: -(Math.random() * 25 + 10),
          robot_utilization: Math.random() * 15 + 80,
          collision_events: Math.floor(Math.random() * 3),
          maintenance_triggers: Math.floor(Math.random() * 2)
        },
        robotImpact: robots.slice(0, 3).map(r => ({
          robot_id: r.robot_id,
          efficiency_change: (Math.random() * 20 - 5).toFixed(1),
          battery_impact: (Math.random() * 10 - 2).toFixed(1),
          workload_change: (Math.random() * 30 - 10).toFixed(1)
        })),
        recommendation: Math.random() > 0.3 ? "recommended" : "not_recommended"
      };
      
      setSimulationResults(results);
      setSimulationRunning(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Strategy Simulator</h2>
            <p className="text-gray-400 text-sm">Test strategies in virtual environment before deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`glass rounded-xl p-5 text-left smooth-transition ${
                selectedStrategy === strategy.id
                  ? "border-2 border-green-500 bg-green-500/10"
                  : "hover:border-green-500/30"
              }`}
            >
              <h3 className="text-white font-bold mb-2">{strategy.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(strategy.params).map(([key, value]) => (
                  <span key={key} className="glass px-2 py-1 rounded text-xs text-gray-400">
                    {key}: <span className="text-white font-bold">{String(value)}</span>
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={runSimulation}
            disabled={!selectedStrategy || simulationRunning}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-xl font-bold text-white hover:scale-105 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {simulationRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Simulation
              </>
            )}
          </button>
          
          {simulationResults && (
            <button
              onClick={() => setSimulationResults(null)}
              className="glass px-6 py-4 rounded-xl hover:bg-white/5 smooth-transition"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {simulationResults && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Simulation Results</h3>
            <span className={`px-4 py-2 rounded-xl font-bold ${
              simulationResults.recommendation === "recommended"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}>
              {simulationResults.recommendation === "recommended" ? "✓ RECOMMENDED" : "⚠ NOT RECOMMENDED"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Efficiency Gain", value: `+${simulationResults.metrics.efficiency_gain.toFixed(1)}%`, positive: true },
              { label: "Energy Saved", value: `${simulationResults.metrics.energy_saved.toFixed(1)}%`, positive: true },
              { label: "Completion Time", value: `${simulationResults.metrics.task_completion_time.toFixed(1)}%`, positive: simulationResults.metrics.task_completion_time < 0 },
              { label: "Robot Utilization", value: `${simulationResults.metrics.robot_utilization.toFixed(1)}%`, positive: true },
              { label: "Collision Events", value: simulationResults.metrics.collision_events, positive: false },
              { label: "Maintenance Triggers", value: simulationResults.metrics.maintenance_triggers, positive: false }
            ].map((metric, idx) => (
              <div key={idx} className="glass rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-1">{metric.label}</p>
                <p className={`text-2xl font-black ${
                  (metric.positive && parseFloat(String(metric.value)) > 0) || (!metric.positive && parseFloat(String(metric.value)) === 0)
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Per-Robot Impact</h4>
            <div className="space-y-3">
              {simulationResults.robotImpact.map((impact: any) => (
                <div key={impact.robot_id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{impact.robot_id}</span>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Efficiency: </span>
                        <span className={parseFloat(impact.efficiency_change) > 0 ? "text-green-400" : "text-red-400"}>
                          {impact.efficiency_change > 0 ? "+" : ""}{impact.efficiency_change}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Battery: </span>
                        <span className={parseFloat(impact.battery_impact) > 0 ? "text-green-400" : "text-red-400"}>
                          {impact.battery_impact > 0 ? "+" : ""}{impact.battery_impact}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Workload: </span>
                        <span className="text-white">{impact.workload_change > 0 ? "+" : ""}{impact.workload_change}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-xl font-bold text-white hover:scale-105 smooth-transition">
              Deploy This Strategy to Fleet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}