"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  Factory,
  Box,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  User,
  Gauge,
  Settings,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  overviewStats,
  equipment,
  productionLines,
  alerts,
  oeeTrend,
  type LineStatus,
  type ProductionLine,
} from "@/lib/sample-data";

// Status badge component
function StatusBadge({ status }: { status: LineStatus }) {
  const styles = {
    running: "status-running",
    idle: "status-idle",
    down: "status-down",
    changeover: "status-changeover",
  };

  const labels = {
    running: "Running",
    idle: "Idle",
    down: "Down",
    changeover: "Changeover",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// OEE meter component — instrument gauge style
function OEEMeter({
  value,
  label,
  size = "normal",
}: {
  value: number;
  label: string;
  size?: "small" | "normal";
}) {
  const getColor = (val: number) => {
    if (val >= 85) return "#22c55e";
    if (val >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getGlowClass = (val: number) => {
    if (val >= 85) return "oee-glow-green";
    if (val >= 70) return "oee-glow-amber";
    return "oee-glow-red";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[#5a6a80] uppercase tracking-wider ${size === "small" ? "text-[10px]" : "text-xs"}`}>
          {label}
        </span>
        <span className={`font-data font-semibold ${size === "small" ? "text-sm" : "text-base"}`}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className={`oee-meter ${size === "small" ? "h-1.5" : "h-2.5"} relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`oee-fill h-full rounded-sm ${getGlowClass(value)}`}
          style={{ backgroundColor: getColor(value) }}
        />
        {/* Threshold markers at 70% and 85% */}
        <div className="oee-threshold" style={{ left: "70%" }} />
        <div className="oee-threshold" style={{ left: "85%" }} />
      </div>
    </div>
  );
}

// Line card component
function LineCard({ line }: { line: ProductionLine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bella-card p-4 overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{line.name}</h3>
          <div className="mt-1">
            <StatusBadge status={line.status} />
          </div>
        </div>
        {line.status === "running" && (
          <div className="text-right flex-shrink-0">
            <span className="font-data text-2xl sm:text-3xl font-bold text-[#00b4d8]">
              {line.oee.toFixed(1)}
            </span>
            <span className="font-data text-sm text-[#5a6a80]">%</span>
            <p className="text-[10px] text-[#5a6a80] uppercase tracking-wider">OEE</p>
          </div>
        )}
      </div>

      {line.status === "running" ? (
        <>
          <div className="flex items-center gap-2 text-sm text-[#5a6a80] mb-2 min-w-0">
            <Box className="w-3.5 h-3.5 flex-shrink-0 text-[#00b4d8]" />
            <span className="truncate font-data text-xs">{line.product}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#5a6a80] mb-4 min-w-0">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate text-xs">{line.operator}</span>
          </div>

          <div className="space-y-2.5">
            <OEEMeter value={line.availability} label="Availability" size="small" />
            <OEEMeter value={line.performance} label="Performance" size="small" />
            <OEEMeter value={line.quality} label="Quality" size="small" />
          </div>
        </>
      ) : line.status === "changeover" ? (
        <div className="flex items-center gap-2 text-sm text-[#f59e0b]">
          <Clock className="w-4 h-4" />
          <span className="text-xs">{line.issue}</span>
        </div>
      ) : line.status === "down" ? (
        <div>
          <div className="flex items-center gap-2 text-sm text-[#ef4444] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">{line.issue}</span>
          </div>
          <span className="text-[10px] text-[#5a6a80] font-data">{line.issueTime}</span>
        </div>
      ) : (
        <div className="text-sm text-[#5a6a80]">
          <Box className="w-4 h-4 inline mr-2" />
          <span className="font-data text-xs">{line.product}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function BellaPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const unacknowledgedAlerts = alerts.filter((a) => a.severity !== "info").length;

  return (
    <main className="min-h-screen">
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent opacity-60" />

      {/* Header */}
      <header className="border-b border-[#1a2236] bg-[#080c14]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 text-[#5a6a80] hover:text-white bg-[#0f1520] hover:bg-[#1a2236] border border-[#1a2236] rounded-md transition-all group text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00b4d8] to-[#0077b6] flex items-center justify-center shadow-lg shadow-[#00b4d8]/20">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Project BELLA</h1>
                <p className="text-xs text-[#5a6a80] tracking-wide">Batch &amp; Equipment Line-Level Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-400 pulse-live" />
                <span className="text-[#5a6a80] uppercase tracking-wider font-semibold">Live</span>
              </div>
              <button className="p-2 hover:bg-[#1a2236] rounded-md transition-colors border border-transparent hover:border-[#1a2236]">
                <RefreshCw className="w-4 h-4 text-[#5a6a80]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Equipment Diagram / P&ID Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bella-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider">Production Line Status</h3>
              <p className="text-xs text-[#5a6a80] mt-1">Equipment flow diagram — All Systems Running</p>
            </div>
            <div className="text-[10px] text-[#5a6a80] uppercase tracking-wider border border-[#1a2236] rounded px-2 py-1">
              P&amp;ID View
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {equipment.map((eq, index) => (
              <div key={eq.id} className="flex items-center gap-1 sm:gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedEquipment(eq.id)}
                  className={`equipment-box ${eq.status} px-3 sm:px-5 py-3 cursor-pointer overflow-hidden min-w-[80px]`}
                >
                  <div className="text-center">
                    <p className="font-medium text-xs sm:text-sm truncate">{eq.name}</p>
                    <div className="mt-1">
                      <StatusBadge status={eq.status} />
                    </div>
                  </div>
                </motion.div>
                {/* Flow arrow between equipment */}
                {index < equipment.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`equipment-arrow hidden sm:block ${eq.status === "running" ? "active" : ""}`}
                  >
                    →
                  </motion.span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-5 text-[10px] text-[#5a6a80] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-green-500 shadow-sm shadow-green-500/30" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#5a6a80]" />
              <span>Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm shadow-red-500/30" />
              <span>Down</span>
            </div>
          </div>
          <p className="text-[10px] text-[#5a6a80] text-center mt-2 tracking-wide">Click equipment for details</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bella-card p-4 overflow-hidden"
          >
            <p className="text-[10px] text-[#5a6a80] uppercase tracking-wider font-semibold">Plant OEE</p>
            <div className="flex flex-wrap items-end gap-x-2 mt-2">
              <span className="font-data text-2xl sm:text-3xl font-bold text-[#00b4d8]">{overviewStats.plantOee}%</span>
              <span className="text-xs text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span className="font-data">+{overviewStats.oeeChange}%</span>
              </span>
            </div>
            <p className="text-[10px] text-[#5a6a80] mt-1">vs. yesterday</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bella-card p-4 overflow-hidden"
          >
            <p className="text-[10px] text-[#5a6a80] uppercase tracking-wider font-semibold">Lines Running</p>
            <div className="flex items-end gap-1 mt-2">
              <span className="font-data text-2xl sm:text-3xl font-bold">{overviewStats.linesRunning}</span>
              <span className="font-data text-lg text-[#5a6a80] mb-0.5">/ {overviewStats.totalLines}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bella-card p-4 overflow-hidden"
          >
            <p className="text-[10px] text-[#5a6a80] uppercase tracking-wider font-semibold">Units Today</p>
            <div className="flex flex-wrap items-end gap-x-2 mt-2">
              <span className="font-data text-2xl sm:text-3xl font-bold">{overviewStats.unitsToday.toLocaleString()}</span>
              <span className="text-xs text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span className="font-data">+{overviewStats.unitsChange}%</span>
              </span>
            </div>
            <p className="text-[10px] text-[#5a6a80] mt-1">vs. target</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bella-card p-4 overflow-hidden"
          >
            <p className="text-[10px] text-[#5a6a80] uppercase tracking-wider font-semibold">Quality Rate</p>
            <div className="flex flex-wrap items-end gap-x-2 mt-2">
              <span className="font-data text-2xl sm:text-3xl font-bold">{overviewStats.qualityRate}%</span>
              <span className="text-xs text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span className="font-data">+{overviewStats.qualityChange}%</span>
              </span>
            </div>
            <p className="text-[10px] text-[#5a6a80] mt-1">vs. yesterday</p>
          </motion.div>
        </div>

        {/* OEE Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bella-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">OEE Trend (Today)</h3>
            <span className="text-[10px] text-[#5a6a80] font-data uppercase tracking-wider">Last updated: 2 min ago</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oeeTrend}>
                <defs>
                  <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00b4d8" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#00b4d8" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#00b4d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 34, 54, 0.6)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#5a6a80", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={{ stroke: "#1a2236" }}
                  tickLine={{ stroke: "#1a2236" }}
                />
                <YAxis
                  tick={{ fill: "#5a6a80", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={{ stroke: "#1a2236" }}
                  tickLine={{ stroke: "#1a2236" }}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1520",
                    border: "1px solid rgba(0, 180, 216, 0.2)",
                    borderRadius: "6px",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#5a6a80" }}
                />
                <Area
                  type="monotone"
                  dataKey="oee"
                  stroke="#00b4d8"
                  fill="url(#oeeGradient)"
                  strokeWidth={2}
                  dot={{ fill: "#00b4d8", strokeWidth: 0, r: 3 }}
                  activeDot={{ fill: "#0ef", strokeWidth: 0, r: 5, filter: "drop-shadow(0 0 4px rgba(0, 238, 255, 0.5))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bella-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Active Alerts</h3>
            <span className="px-2 py-0.5 bg-red-500/15 text-red-400 rounded text-[10px] font-semibold uppercase tracking-wider border border-red-500/20">
              {unacknowledgedAlerts} unacknowledged
            </span>
          </div>

          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`alert-item alert-${alert.severity} p-3 rounded-r-md`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs">{alert.message}</p>
                  <span className="text-[10px] text-[#5a6a80] whitespace-nowrap ml-4 font-data">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Production Lines */}
        <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[#5a6a80]">Production Lines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productionLines.map((line, index) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <LineCard line={line} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a2236] mt-16 py-6 text-center text-[#5a6a80] text-[10px] uppercase tracking-widest">
        <p>BELLA MES Demo | Manufacturing Intelligence Platform</p>
      </footer>
    </main>
  );
}
