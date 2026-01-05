"use client";

import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "@/lib/useWebSocket";
import { getFleetStatus } from "@/lib/api";
import FleetStatus from "@/components/FleetStatus";
import RobotCard from "@/components/RobotCard";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import AlertsView from "@/components/AlertsView";
import RobotModal from "@/components/RobotModal";
import TimeMachine from "@/components/TimeMachine";
import StrategySimulator from "@/components/StrategySimulator";
import RobotDNA from "@/components/RobotDNA";
import AnomalyDetection from "@/components/AnomalyDetection";
import EnergyTrading from "@/components/EnergyTrading";

export default function Home() {
  const { robots: wsRobots, connected } = useWebSocket();
  const [robots, setRobots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("grid");
  const [activeTab, setActiveTab] = useState("fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRobot, setSelectedRobot] = useState<any>(null);
  const initialLoadDone = useRef(false);
  const lastFetch = useRef(0);

  useEffect(() => {
    async function loadInitialData() {
      const now = Date.now();
      if (now - lastFetch.current < 4000) return;
      lastFetch.current = now;
      
      try {
        const data = await getFleetStatus();
        if (data.robots) {
          setRobots(data.robots);
          initialLoadDone.current = true;
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (!initialLoadDone.current) {
      loadInitialData();
    }
    
    const interval = setInterval(loadInitialData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wsRobots.length > 0 && initialLoadDone.current) {
      setRobots(wsRobots);
    }
  }, [wsRobots]);

  const warehouses = Array.from(new Set(robots.map(r => r.warehouse_id)));
  
  const filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.robot_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         robot.warehouse_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = selectedWarehouse === "all" || robot.warehouse_id === selectedWarehouse;
    const matchesStatus = selectedStatus === "all" || robot.status?.state === selectedStatus;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const tabs = [
    { id: "fleet", label: "Fleet Control" },
    { id: "timemachine", label: "Time Machine" },
    { id: "simulator", label: "Strategy Simulator" },
    { id: "dna", label: "Robot DNA" },
    { id: "anomaly", label: "Anomaly Detection" },
    { id: "trading", label: "Energy Trading" }
  ];

  return (
    <main className="min-h-screen relative bg-black">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        <div className="glass rounded-2xl px-6 py-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="url(#logo-gradient)" />
              <path d="M18 9L24 13.5V22.5L18 27L12 22.5V13.5L18 9Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="18" cy="18" r="3" fill="white" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#06B6D4" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">RobotMetrics</h1>
              <p className="text-xs text-gray-500">Advanced Fleet Command</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30">
              <div className="relative w-2 h-2">
                <div className={`absolute inset-0 rounded-full ${connected ? "bg-cyan-400" : "bg-red-400"}`} />
                {connected && <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <span className={`text-sm font-semibold ${connected ? "text-cyan-400" : "text-red-400"}`}>
                {connected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30">
              <span className="text-xs text-gray-400">FLEET</span>
              <span className="text-lg font-bold text-white">{filteredRobots.length}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-2 mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-xl font-semibold smooth-transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "fleet" && (
          <>
            <FleetStatus robots={filteredRobots} />

            <div className="mt-6 grid grid-cols-[280px_1fr] gap-6">
              <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedWarehouse={selectedWarehouse}
                setSelectedWarehouse={setSelectedWarehouse}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                warehouses={warehouses}
              />

              <div>
                {loading ? (
                  <div className="glass rounded-2xl p-20 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-cyan-300">Loading...</p>
                  </div>
                ) : filteredRobots.length === 0 ? (
                  <div className="glass rounded-2xl p-20 text-center">
                    <p className="text-xl text-white mb-2">No robots found</p>
                    <p className="text-gray-400">Try adjusting your filters</p>
                  </div>
                ) : (
                  <>
                    {activeView === "grid" && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {filteredRobots.map((robot) => (
                          <div key={robot.robot_id} onClick={() => setSelectedRobot(robot)} className="cursor-pointer">
                            <RobotCard robot={robot} />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {activeView === "map" && (
                      <MapView robots={filteredRobots} onRobotClick={setSelectedRobot} />
                    )}
                    
                    {activeView === "alerts" && (
                      <AlertsView robots={filteredRobots} onRobotClick={setSelectedRobot} />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "timemachine" && <TimeMachine robots={robots} />}
        {activeTab === "simulator" && <StrategySimulator robots={robots} />}
        {activeTab === "dna" && <RobotDNA robots={robots} />}
        {activeTab === "anomaly" && <AnomalyDetection robots={robots} />}
        {activeTab === "trading" && <EnergyTrading robots={robots} />}
      </div>

      {selectedRobot && (
        <RobotModal robot={selectedRobot} onClose={() => setSelectedRobot(null)} />
      )}
    </main>
  );
}