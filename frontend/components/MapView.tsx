"use client";

import { MapPin } from "lucide-react";

interface MapViewProps {
  robots: any[];
  onRobotClick: (robot: any) => void;
}

export default function MapView({ robots, onRobotClick }: MapViewProps) {
  const minX = Math.min(...robots.map(r => r.position?.x || 0)) - 2;
  const maxX = Math.max(...robots.map(r => r.position?.x || 0)) + 2;
  const minY = Math.min(...robots.map(r => r.position?.y || 0)) - 2;
  const maxY = Math.max(...robots.map(r => r.position?.y || 0)) + 2;

  const normalizeX = (x: number) => ((x - minX) / (maxX - minX)) * 100;
  const normalizeY = (y: number) => ((y - minY) / (maxY - minY)) * 100;

  const getStatusColor = (state: string) => {
    switch(state) {
      case "moving": return "bg-green-500";
      case "charging": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="glass rounded-2xl p-6 h-[600px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      
      <div className="absolute inset-6 border border-gray-700 rounded-xl">
        {robots.map((robot) => {
          const x = normalizeX(robot.position?.x || 0);
          const y = 100 - normalizeY(robot.position?.y || 0);
          
          return (
            <button
              key={robot.robot_id}
              onClick={() => onRobotClick(robot)}
              className="absolute group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`w-3 h-3 rounded-full ${getStatusColor(robot.status?.state)} animate-pulse`} />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none">
                <div className="glass rounded-lg px-3 py-2 whitespace-nowrap">
                  <p className="text-xs font-bold text-white">{robot.robot_id}</p>
                  <p className="text-xs text-gray-400">{robot.warehouse_id}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute top-6 right-6 glass rounded-lg px-3 py-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-gray-400">Charging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-gray-400">Idle</span>
          </div>
        </div>
      </div>
    </div>
  );
}