"use client";

import { Dna, TrendingUp, Clock, Award } from "lucide-react";
import { useState, useEffect } from "react";

interface RobotDNAProps {
  robots: any[];
}

export default function RobotDNA({ robots }: RobotDNAProps) {
  const [selectedRobot, setSelectedRobot] = useState<any>(null);
  const [behaviorProfiles, setBehaviorProfiles] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const profiles = new Map();
    
    robots.forEach(robot => {
      const avgCpu = robot.system?.cpu_percent || 0;
      const avgBattery = robot.system?.battery_percent || 100;
      const movementPattern = robot.status?.state === "moving" ? "active" : "conservative";
      
      const efficiency = avgBattery > 70 ? (avgCpu < 50 ? "high" : "medium") : "low";
      const personality = avgCpu > 60 ? "aggressive" : avgCpu > 30 ? "balanced" : "conservative";
      
      profiles.set(robot.robot_id, {
        efficiency_rating: efficiency,
        personality_type: personality,
        movement_style: movementPattern,
        task_preference: robot.status?.current_task ? "task-oriented" : "idle-ready",
        avg_cpu: avgCpu,
        avg_battery: avgBattery,
        uptime_hours: Math.floor(Math.random() * 1000) + 500,
        tasks_completed: Math.floor(Math.random() * 5000) + 1000,
        unique_traits: [
          avgCpu < 30 ? "Energy Efficient" : avgCpu > 70 ? "High Performance" : "Balanced",
          avgBattery > 80 ? "Long Runtime" : "Frequent Charging",
          movementPattern === "active" ? "Mobile" : "Stationary"
        ],
        learned_behaviors: [
          { behavior: "Optimal charging time", value: "2:00 AM - 4:00 AM", confidence: 94 },
          { behavior: "Peak performance window", value: "9:00 AM - 3:00 PM", confidence: 88 },
          { behavior: "Preferred work zone", value: "Section B-4", confidence: 91 }
        ]
      });
    });
    
    setBehaviorProfiles(profiles);
  }, [robots]);

  useEffect(() => {
    if (robots.length > 0 && !selectedRobot) {
      setSelectedRobot(robots[0]);
    }
  }, [robots, selectedRobot]);

  const profile = selectedRobot ? behaviorProfiles.get(selectedRobot.robot_id) : null;

  const getEfficiencyColor = (rating: string) => {
    switch(rating) {
      case "high": return "from-green-500 to-emerald-500";
      case "medium": return "from-yellow-500 to-orange-500";
      case "low": return "from-red-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div className="glass rounded-2xl p-4">
        <h3 className="text-white font-bold mb-4">Select Robot</h3>
        <div className="space-y-2">
          {robots.map((robot) => {
            const robotProfile = behaviorProfiles.get(robot.robot_id);
            return (
              <button
                key={robot.robot_id}
                onClick={() => setSelectedRobot(robot)}
                className={`w-full glass rounded-xl p-3 text-left smooth-transition ${
                  selectedRobot?.robot_id === robot.robot_id
                    ? "border-2 border-cyan-500 bg-cyan-500/10"
                    : "hover:border-cyan-500/30"
                }`}
              >
                <p className="text-white font-bold text-sm">{robot.robot_id}</p>
                <p className="text-gray-400 text-xs">{robot.warehouse_id}</p>
                {robotProfile && (
                  <div className="mt-2 flex gap-1">
                    {robotProfile.unique_traits.slice(0, 2).map((trait: string, idx: number) => (
                      <span key={idx} className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedRobot && profile ? (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                <Dna className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">{selectedRobot.robot_id}</h2>
                <p className="text-gray-400">Behavioral DNA Profile</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400 text-xs">Efficiency</span>
                </div>
                <p className={`text-2xl font-black bg-gradient-to-r ${getEfficiencyColor(profile.efficiency_rating)} bg-clip-text text-transparent uppercase`}>
                  {profile.efficiency_rating}
                </p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-400 text-xs">Tasks Completed</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {profile.tasks_completed.toLocaleString()}
                </p>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-xs">Uptime</span>
                </div>
                <p className="text-2xl font-black text-white">
                  {profile.uptime_hours}h
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-2">Personality Type</p>
                <p className="text-white font-bold text-lg capitalize">{profile.personality_type}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-2">Movement Style</p>
                <p className="text-white font-bold text-lg capitalize">{profile.movement_style}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-5 mb-6">
              <h3 className="text-white font-bold mb-3">Unique Traits</h3>
              <div className="flex flex-wrap gap-2">
                {profile.unique_traits.map((trait: string, idx: number) => (
                  <span key={idx} className="glass px-4 py-2 rounded-lg text-cyan-400 font-medium">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="text-white font-bold mb-4">Learned Behaviors</h3>
              <div className="space-y-3">
                {profile.learned_behaviors.map((behavior: any, idx: number) => (
                  <div key={idx} className="glass rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{behavior.behavior}</p>
                        <p className="text-cyan-400 text-sm mt-1">{behavior.value}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {behavior.confidence}% confidence
                      </span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${behavior.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-20 text-center">
          <Dna className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
          <p className="text-white text-xl mb-2">No Robot Selected</p>
          <p className="text-gray-400">Select a robot to view its behavioral profile</p>
        </div>
      )}
    </div>
  );
}