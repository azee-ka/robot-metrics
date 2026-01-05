"use client";

import { History, Play, Pause, SkipBack, SkipForward, Rewind } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TimeMachineProps {
  robots: any[];
}

export default function TimeMachine({ robots }: TimeMachineProps) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [recordedHistory, setRecordedHistory] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  
  const recordInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    recordInterval.current = setInterval(() => {
      const snapshot = {
        timestamp: Date.now(),
        robots: robots.map(r => ({
          robot_id: r.robot_id,
          position: r.position,
          system: r.system,
          network: r.network,
          status: r.status
        }))
      };
      
      setRecordedHistory(prev => {
        const newHistory = [...prev, snapshot];
        return newHistory.slice(-3600);
      });
    }, 1000);

    return () => {
      if (recordInterval.current) clearInterval(recordInterval.current);
    };
  }, [robots]);

  const detectedIncidents = [
    {
      id: 1,
      timestamp: Date.now() - 300000,
      type: "collision_avoidance",
      robots: ["robot_001", "robot_003"],
      description: "Near-collision detected - emergency stop triggered",
      severity: "high"
    },
    {
      id: 2,
      timestamp: Date.now() - 180000,
      type: "performance_drop",
      robots: ["robot_002"],
      description: "Sudden CPU spike to 95% - recovered automatically",
      severity: "medium"
    },
    {
      id: 3,
      timestamp: Date.now() - 120000,
      type: "route_inefficiency",
      robots: ["robot_004"],
      description: "Took 45% longer route - pathfinding issue",
      severity: "low"
    }
  ];

  const handleReplay = (incident: any) => {
    setSelectedIncident(incident);
    setCurrentTimestamp(incident.timestamp);
    setIsReplaying(true);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Time Machine</h2>
              <p className="text-gray-400 text-sm">Replay & debug any past moment</p>
            </div>
          </div>
          
          <div className="glass rounded-xl px-4 py-2">
            <span className="text-gray-400 text-xs">Recording: </span>
            <span className="text-green-400 font-bold">{recordedHistory.length} snapshots</span>
          </div>
        </div>

        {selectedIncident && (
          <div className="glass rounded-xl p-6 mb-6 border-2 border-purple-500/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold">Replaying Incident</h3>
                <p className="text-gray-400 text-sm">{selectedIncident.description}</p>
              </div>
              <button
                onClick={() => {
                  setIsReplaying(false);
                  setSelectedIncident(null);
                }}
                className="glass px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/20"
              >
                Stop Replay
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Timeline</span>
                  <span className="text-white font-mono">{formatTime(currentTimestamp)}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${((currentTimestamp - selectedIncident.timestamp + 60000) / 120000) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button className="glass p-3 rounded-lg hover:bg-white/5">
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button className="glass p-3 rounded-lg hover:bg-white/5">
                  <Rewind className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => setIsReplaying(!isReplaying)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl hover:scale-105 smooth-transition"
                >
                  {isReplaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                </button>
                <button className="glass p-3 rounded-lg hover:bg-white/5">
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
                <select
                  value={replaySpeed}
                  onChange={(e) => setReplaySpeed(Number(e.target.value))}
                  className="glass px-3 py-2 rounded-lg text-white text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {selectedIncident.robots.map((robotId: string) => {
                  const robot = robots.find(r => r.robot_id === robotId);
                  return robot ? (
                    <div key={robotId} className="glass rounded-lg p-3">
                      <p className="text-white font-bold text-sm mb-2">{robotId}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Position</span>
                          <span className="text-cyan-400 font-mono">
                            {robot.position?.x?.toFixed(1)}, {robot.position?.y?.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">CPU</span>
                          <span className="text-white">{robot.system?.cpu_percent?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-green-400">{robot.status?.state}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-white font-bold mb-3">Detected Incidents</h3>
          <div className="space-y-3">
            {detectedIncidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => handleReplay(incident)}
                className="w-full glass rounded-xl p-4 hover:border-purple-500/50 smooth-transition text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        incident.severity === "high" ? "bg-red-500/20 text-red-400" :
                        incident.severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">{getTimeAgo(incident.timestamp)}</span>
                    </div>
                    <p className="text-white font-medium text-sm mb-1">{incident.description}</p>
                    <p className="text-gray-400 text-xs">
                      Robots: {incident.robots.join(", ")}
                    </p>
                  </div>
                  <Play className="w-5 h-5 text-purple-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}