"use client";

import { TrendingDown, AlertTriangle, Clock, Wrench } from "lucide-react";

interface PredictiveAIProps {
  robots: any[];
}

export default function PredictiveAI({ robots }: PredictiveAIProps) {
  const predictions = [
    {
      robot_id: "robot_001",
      prediction: "Battery degradation detected",
      probability: 87,
      timeframe: "Next 6 hours",
      impact: "High",
      recommendation: "Schedule battery replacement during next maintenance window",
      severity: "warning"
    },
    {
      robot_id: "robot_003",
      prediction: "Motor overheating pattern detected",
      probability: 92,
      timeframe: "Next 2 hours",
      impact: "Critical",
      recommendation: "Reduce workload immediately, schedule inspection",
      severity: "critical"
    },
    {
      robot_id: "robot_005",
      prediction: "Sensor drift in navigation system",
      probability: 78,
      timeframe: "Next 12 hours",
      impact: "Medium",
      recommendation: "Recalibrate sensors, monitor position accuracy",
      severity: "warning"
    }
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
          <TrendingDown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Predictive Failure Detection</h2>
          <p className="text-gray-400 text-sm">AI predicts issues before they happen</p>
        </div>
      </div>

      <div className="space-y-4">
        {predictions.map((pred, idx) => (
          <div 
            key={idx}
            className={`glass rounded-xl p-5 border-2 ${
              pred.severity === "critical" ? "border-red-500/50 bg-red-500/5" : "border-yellow-500/50 bg-yellow-500/5"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold">{pred.robot_id}</h3>
                <p className={`text-sm font-medium ${pred.severity === "critical" ? "text-red-400" : "text-yellow-400"}`}>
                  {pred.prediction}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Probability</p>
                <p className={`text-2xl font-black ${pred.severity === "critical" ? "text-red-400" : "text-yellow-400"}`}>
                  {pred.probability}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="glass rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">Timeframe</p>
                </div>
                <p className="text-white text-sm font-bold">{pred.timeframe}</p>
              </div>
              <div className="glass rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">Impact</p>
                </div>
                <p className={`text-sm font-bold ${pred.impact === "Critical" ? "text-red-400" : "text-yellow-400"}`}>
                  {pred.impact}
                </p>
              </div>
            </div>

            <div className="glass rounded-lg p-3 border border-cyan-500/30">
              <div className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">AI Recommendation</p>
                  <p className="text-white text-sm">{pred.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}