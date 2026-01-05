"use client";

import { Zap, ArrowRightLeft, TrendingUp, Battery } from "lucide-react";
import { useState, useEffect } from "react";

interface EnergyTradingProps {
  robots: any[];
}

export default function EnergyTrading({ robots }: EnergyTradingProps) {
  const [activeNegotiations, setActiveNegotiations] = useState<any[]>([]);
  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [chargingSlots, setChargingSlots] = useState<any[]>([]);

  useEffect(() => {
    const slots = [
      { id: "A1", warehouse: "warehouse_A", available: true, priority_cost: 10, standard_cost: 5 },
      { id: "A2", warehouse: "warehouse_A", available: false, priority_cost: 10, standard_cost: 5 },
      { id: "A3", warehouse: "warehouse_A", available: true, priority_cost: 10, standard_cost: 5 },
      { id: "B1", warehouse: "warehouse_B", available: true, priority_cost: 12, standard_cost: 6 },
      { id: "B2", warehouse: "warehouse_B", available: true, priority_cost: 12, standard_cost: 6 },
    ];
    setChargingSlots(slots);

    const negotiations: any[] = [];
    const trades: any[] = [];

    robots.forEach(robot => {
      if (robot.system?.battery_percent < 40 && robot.system.battery_percent > 20) {
        negotiations.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          battery_level: robot.system.battery_percent,
          bid_amount: Math.floor(robot.system.battery_percent < 30 ? 10 : 5),
          priority: robot.system.battery_percent < 30 ? "high" : "normal",
          status: "negotiating",
          requested_slot: slots.find(s => s.warehouse === robot.warehouse_id && s.available)?.id || "A1"
        });
      }

      if (robot.system?.battery_percent > 90 && robot.status?.state === "idle") {
        trades.push({
          robot_id: robot.robot_id,
          warehouse_id: robot.warehouse_id,
          action: "offered_slot",
          credits_earned: 8,
          time: new Date(Date.now() - Math.random() * 300000)
        });
      }
    });

    setActiveNegotiations(negotiations);
    setCompletedTrades(trades.slice(0, 5));
  }, [robots]);

  const totalCreditsCirculating = activeNegotiations.reduce((sum, n) => sum + n.bid_amount, 0);
  const avgBidPrice = activeNegotiations.length > 0 
    ? (totalCreditsCirculating / activeNegotiations.length).toFixed(1) 
    : "0";

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl">
            <ArrowRightLeft className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Energy Trading System</h2>
            <p className="text-gray-400">Robots negotiate charging slots dynamically</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-xs">Active Bids</span>
            </div>
            <p className="text-3xl font-black text-white">{activeNegotiations.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs">Available Slots</span>
            </div>
            <p className="text-3xl font-black text-white">
              {chargingSlots.filter(s => s.available).length}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400 text-xs">Avg Bid Price</span>
            </div>
            <p className="text-3xl font-black text-white">{avgBidPrice}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs">Total Credits</span>
            </div>
            <p className="text-3xl font-black text-white">{totalCreditsCirculating}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Active Negotiations</h3>
          {activeNegotiations.length === 0 ? (
            <div className="text-center py-8">
              <ArrowRightLeft className="w-12 h-12 text-gray-500/30 mx-auto mb-3" />
              <p className="text-gray-400">No active negotiations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeNegotiations.map((nego, idx) => (
                <div key={idx} className="glass rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold">{nego.robot_id}</p>
                      <p className="text-gray-400 text-xs">{nego.warehouse_id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      nego.priority === "high" 
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {nego.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-gray-500 text-xs">Battery</p>
                      <p className="text-white font-bold">{nego.battery_level.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Bid Amount</p>
                      <p className="text-yellow-400 font-bold">{nego.bid_amount} credits</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Slot</p>
                      <p className="text-cyan-400 font-bold">{nego.requested_slot}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-lg text-white text-xs font-bold hover:scale-105 smooth-transition">
                      Accept Bid
                    </button>
                    <button className="flex-1 glass px-3 py-2 rounded-lg text-white text-xs font-bold hover:bg-white/5 smooth-transition">
                      Counter Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Charging Slots Status</h3>
            <div className="space-y-3">
              {chargingSlots.map((slot) => (
                <div key={slot.id} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        slot.available ? "bg-green-400 animate-pulse" : "bg-red-400"
                      }`} />
                      <div>
                        <p className="text-white font-bold">Slot {slot.id}</p>
                        <p className="text-gray-400 text-xs">{slot.warehouse}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${
                      slot.available ? "text-green-400" : "text-red-400"
                    }`}>
                      {slot.available ? "AVAILABLE" : "OCCUPIED"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Priority: </span>
                      <span className="text-yellow-400">{slot.priority_cost} credits</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Standard: </span>
                      <span className="text-cyan-400">{slot.standard_cost} credits</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Recent Trades</h3>
            {completedTrades.length === 0 ? (
              <div className="text-center py-6">
                <TrendingUp className="w-10 h-10 text-gray-500/30 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No recent trades</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedTrades.map((trade, idx) => (
                  <div key={idx} className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-bold">{trade.robot_id}</p>
                        <p className="text-gray-400 text-xs">{trade.action.replace(/_/g, " ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-sm font-bold">+{trade.credits_earned}</p>
                        <p className="text-gray-500 text-xs">
                          {Math.floor((Date.now() - trade.time.getTime()) / 60000)}m ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}