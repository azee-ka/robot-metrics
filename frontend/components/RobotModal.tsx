"use client";

import { X, Cpu, HardDrive, Battery, Wifi, MapPin, Zap, Clock } from "lucide-react";

interface RobotModalProps {
  robot: any;
  onClose: () => void;
}

export default function RobotModal({ robot, onClose }: RobotModalProps) {
  if (!robot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-white">{robot.robot_id}</h2>
            <p className="text-gray-400">{robot.warehouse_id}</p>
          </div>
          <button
            onClick={onClose}
            className="glass rounded-lg p-2 hover:bg-red-500/20 smooth-transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">CPU Usage</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">{robot.system?.cpu_percent?.toFixed(1)}%</p>
          </div>
          
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Memory</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{robot.system?.memory_percent?.toFixed(1)}%</p>
          </div>
          
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Battery</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{robot.system?.battery_percent?.toFixed(1)}%</p>
          </div>
          
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Latency</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{robot.network?.latency_ms?.toFixed(1)}ms</p>
          </div>
        </div>

        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-400">Position</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">X Coordinate</p>
              <p className="text-lg font-bold text-white font-mono">{robot.position?.x?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Y Coordinate</p>
              <p className="text-lg font-bold text-white font-mono">{robot.position?.y?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {robot.status?.current_task && (
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Current Task</span>
            </div>
            <p className="text-white font-medium mb-3">{robot.status.current_task}</p>
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                style={{ width: `${robot.status.task_progress}%` }}
              />
            </div>
            <p className="text-xs text-cyan-400 font-bold mt-2">{robot.status.task_progress}% Complete</p>
          </div>
        )}
      </div>
    </div>
  );
}