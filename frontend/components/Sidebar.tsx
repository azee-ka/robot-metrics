"use client";

import { Search, Filter, Map, LayoutGrid, AlertCircle, BarChart3 } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (warehouse: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  warehouses: string[];
}

export default function Sidebar({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  selectedWarehouse,
  setSelectedWarehouse,
  selectedStatus,
  setSelectedStatus,
  warehouses
}: SidebarProps) {
  const views = [
    { id: "grid", icon: LayoutGrid, label: "Grid View" },
    { id: "map", icon: Map, label: "Map View" },
    { id: "alerts", icon: AlertCircle, label: "Alerts" },
    { id: "analytics", icon: BarChart3, label: "Analytics" }
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "moving", label: "Active" },
    { value: "idle", label: "Idle" },
    { value: "charging", label: "Charging" }
  ];

  return (
    <div className="glass rounded-2xl p-4 h-full flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search robots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/30 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider px-2">View</label>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg smooth-transition ${
              activeView === view.id
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
          >
            <view.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{view.label}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-800" />

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2 block">Warehouse</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>{wh}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2 block">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}