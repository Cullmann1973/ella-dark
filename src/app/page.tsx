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
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// OEE meter component
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

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[#6b6b80] ${size === "small" ? "text-xs" : "text-sm"}`}>{label}</span>
        <span className={`font-semibold ${size === "small" ? "text-sm" : ""}`}>{value.toFixed(1)}%</span>
      </div>
      <div className={`oee-meter ${size === "small" ? "h-1.5" : "h-2"}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="oee-fill h-full rounded"
          style={{ backgroundColor: getColor(value) }}
        />
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
      className="ella-card p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{line.name}</h3>
          <StatusBadge status={line.status} />
        </div>
        {line.status === "running" && (
          <div className="text-right">
            <span className="text-2xl font-bold">{line.oee.toFixed(1)}%</span>
            <p className="text-xs text-[#6b6b80]">OEE</p>
          </div>
        )}
      </div>

      {line.status === "running" ? (
        <>
          <div className="flex items-center gap-2 text-sm text-[#6b6b80] mb-3">
            <Box className="w-4 h-4" />
            <span>{line.product}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6b6b80] mb-4">
            <User className="w-4 h-4" />
            <span>Operator: {line.operator}</span>
          </div>

          <div className="space-y-2">
            <OEEMeter value={line.availability} label="Avail" size="small" />
            <OEEMeter value={line.performance} label="Perf" size="small" />
            <OEEMeter value={line.quality} label="Quality" size="small" />
          </div>
        </>
      ) : line.status === "changeover" ? (
        <div className="flex items-center gap-2 text-sm text-[#f59e0b]">
          <Clock className="w-4 h-4" />
          <span>{line.issue}</span>
        </div>
      ) : line.status === "down" ? (
        <div>
          <div className="flex items-center gap-2 text-sm text-[#ef4444] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{line.issue}</span>
          </div>
          <span className="text-xs text-[#6b6b80]">{line.issueTime}</span>
        </div>
      ) : (
        <div className="text-sm text-[#6b6b80]">
          <Box className="w-4 h-4 inline mr-2" />
          {line.product}
        </div>
      )}
    </motion.div>
  );
}

export default function EllaPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const unacknowledgedAlerts = alerts.filter((a) => a.severity !== "info").length;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#1e1e2a] bg-[#0a0a0f]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={() => window.close()}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 text-[#6b6b80] hover:text-white bg-[#16161f] hover:bg-[#1e1e2a] border border-[#1e1e2a] rounded-lg transition-all group text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Portfolio</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Project ELLA</h1>
                <p className="text-sm text-[#6b6b80]">Enterprise Line-Level Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 pulse-live" />
                <span className="text-[#6b6b80]">Live</span>
              </div>
              <button className="p-2 hover:bg-[#1e1e2a] rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-[#6b6b80]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Equipment Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ella-card p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">Production Line Status</h3>
          <p className="text-sm text-[#6b6b80] mb-4">All Systems Running</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {equipment.map((eq, index) => (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedEquipment(eq.id)}
                className={`equipment-box ${eq.status} px-4 py-3 cursor-pointer`}
              >
                <div className="text-center">
                  <p className="font-medium text-sm">{eq.name}</p>
                  <StatusBadge status={eq.status} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-4 text-xs text-[#6b6b80]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#6b6b80]" />
              <span>Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Down</span>
            </div>
          </div>
          <p className="text-xs text-[#6b6b80] text-center mt-2">Click equipment for details</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ella-card p-4"
          >
            <p className="text-sm text-[#6b6b80]">Plant OEE</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{overviewStats.plantOee}%</span>
              <span className="text-sm text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                +{overviewStats.oeeChange}%
              </span>
            </div>
            <p className="text-xs text-[#6b6b80]">vs. yesterday</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="ella-card p-4"
          >
            <p className="text-sm text-[#6b6b80]">Lines Running</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold">{overviewStats.linesRunning}</span>
              <span className="text-lg text-[#6b6b80] mb-0.5">/ {overviewStats.totalLines}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="ella-card p-4"
          >
            <p className="text-sm text-[#6b6b80]">Units Today</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{overviewStats.unitsToday.toLocaleString()}</span>
              <span className="text-sm text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                +{overviewStats.unitsChange}%
              </span>
            </div>
            <p className="text-xs text-[#6b6b80]">vs. target</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ella-card p-4"
          >
            <p className="text-sm text-[#6b6b80]">Quality Rate</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{overviewStats.qualityRate}%</span>
              <span className="text-sm text-green-400 flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                +{overviewStats.qualityChange}%
              </span>
            </div>
            <p className="text-xs text-[#6b6b80]">vs. yesterday</p>
          </motion.div>
        </div>

        {/* OEE Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ella-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">OEE Trend (Today)</h3>
            <span className="text-xs text-[#6b6b80]">Last updated: 2 min ago</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oeeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" />
                <XAxis dataKey="time" tick={{ fill: "#6b6b80", fontSize: 12 }} axisLine={{ stroke: "#1e1e2a" }} />
                <YAxis tick={{ fill: "#6b6b80", fontSize: 12 }} axisLine={{ stroke: "#1e1e2a" }} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#16161f",
                    border: "1px solid #1e1e2a",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="oee"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                  strokeWidth={2}
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
          className="ella-card p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">
            Active Alerts
            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
              {unacknowledgedAlerts} unacknowledged
            </span>
          </h3>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`alert-item alert-${alert.severity} p-4 rounded-r-lg`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm">{alert.message}</p>
                  <span className="text-xs text-[#6b6b80] whitespace-nowrap ml-4">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Production Lines */}
        <h2 className="text-lg font-semibold mb-4">Production Lines</h2>
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
      <footer className="border-t border-[#1e1e2a] mt-16 py-6 text-center text-[#6b6b80] text-sm">
        <p>Chris Cosmetics | Project ELLA Demo | Not for production use</p>
      </footer>
    </main>
  );
}
