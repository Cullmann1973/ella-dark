export type LineStatus = "running" | "idle" | "down" | "changeover";

export interface ProductionLine {
  id: string;
  name: string;
  status: LineStatus;
  product: string;
  operator: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  issue?: string;
  issueTime?: string;
}

export interface Alert {
  id: number;
  message: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

export interface OverviewStats {
  plantOee: number;
  oeeChange: number;
  linesRunning: number;
  totalLines: number;
  unitsToday: number;
  unitsChange: number;
  qualityRate: number;
  qualityChange: number;
}

export interface Equipment {
  id: string;
  name: string;
  status: LineStatus;
}

export interface TrendData {
  time: string;
  oee: number;
}

export const overviewStats: OverviewStats = {
  plantOee: 78.4,
  oeeChange: 2.1,
  linesRunning: 3,
  totalLines: 5,
  unitsToday: 42380,
  unitsChange: 8.3,
  qualityRate: 97.8,
  qualityChange: 0.3,
};

export const equipment: Equipment[] = [
  { id: "compound", name: "Compound", status: "running" },
  { id: "filler", name: "Filler", status: "running" },
  { id: "capper", name: "Capper", status: "running" },
  { id: "labeler", name: "Labeler", status: "idle" },
  { id: "cartoner", name: "Cartoner", status: "running" },
  { id: "casepacker", name: "Case Packer", status: "down" },
];

export const productionLines: ProductionLine[] = [
  {
    id: "filling-1",
    name: "Filling Line 1",
    status: "running",
    product: "Widget A-100 (30ct)",
    operator: "M. Rodriguez",
    oee: 84.7,
    availability: 92.0,
    performance: 95.0,
    quality: 97.0,
  },
  {
    id: "filling-2",
    name: "Filling Line 2",
    status: "running",
    product: "Assembly B-200 (50ct)",
    operator: "J. Chen",
    oee: 78.2,
    availability: 88.0,
    performance: 91.0,
    quality: 98.0,
  },
  {
    id: "packaging-a",
    name: "Packaging Line A",
    status: "changeover",
    product: "Changeover to Component D-300",
    operator: "S. Williams",
    oee: 0,
    availability: 0,
    performance: 0,
    quality: 0,
    issue: "Changeover in progress",
  },
  {
    id: "packaging-b",
    name: "Packaging Line B",
    status: "running",
    product: "Module C-150 (12pk)",
    operator: "R. Patel",
    oee: 91.2,
    availability: 96.0,
    performance: 97.0,
    quality: 98.0,
  },
  {
    id: "assembly-1",
    name: "Assembly Line 1",
    status: "down",
    product: "Unit E-500 Assembly",
    operator: "K. Martinez",
    oee: 0,
    availability: 0,
    performance: 0,
    quality: 0,
    issue: "Sensor fault - Vision system",
    issueTime: "8 min ago",
  },
];

export const alerts: Alert[] = [
  {
    id: 1,
    message: "Assembly Line 1: Vision system sensor fault detected. Line stopped.",
    time: "8 minutes ago",
    severity: "critical",
  },
  {
    id: 2,
    message: "Filling Line 2: Speed below target (91% of standard). Check filler timing.",
    time: "15 minutes ago",
    severity: "warning",
  },
  {
    id: 3,
    message: "Packaging Line A: Changeover in progress. ETA 22 minutes.",
    time: "35 minutes ago",
    severity: "info",
  },
];

export const oeeTrend: TrendData[] = [
  { time: "06:00", oee: 72 },
  { time: "07:00", oee: 75 },
  { time: "08:00", oee: 78 },
  { time: "09:00", oee: 76 },
  { time: "10:00", oee: 80 },
  { time: "11:00", oee: 82 },
  { time: "12:00", oee: 74 },
  { time: "13:00", oee: 77 },
  { time: "14:00", oee: 78.4 },
];
