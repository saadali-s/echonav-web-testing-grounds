import { DashboardComposer } from '@/components/dashboard/DashboardComposer';

// Mock data placeholder for backend fetch
const mockData = {
  userName: "Admin",
  stats: {
    mappedBuildings: { count: 12, subtext: "Across 3 campuses" },
    activeBeacons: { count: 843, subtext: "98% uptime" },
    pendingTasks: { count: 5, subtext: "2 high priority" },
  },
  recentPlans: [
    { id: "1", name: "Science Wing", building: "Main Campus", updatedAt: "2 hrs ago" },
    { id: "2", name: "Library", building: "East Campus", updatedAt: "5 hrs ago" },
  ],
  healthData: {
    total: 843,
    healthyCount: 800,
    warningCount: 30,
    criticalCount: 13,
    criticalItems: [
      { id: "b1", label: "Auditorium Node", battery: "12%" },
      { id: "b2", label: "Stairwell B Node", battery: "8%" },
    ],
  },
  systemEvents: [
    { id: "e1", type: "HAZARD" as const, title: "Spill Detected", description: "Reported in Chemistry Lab 204", timeAgo: "10m ago" },
    { id: "e2", type: "CALIBRATION" as const, title: "Auto-Calibration", description: "Node array aligned successfully", timeAgo: "1h ago" },
  ],
};

export default function DashboardPage() {
  return <DashboardComposer {...mockData} />;
}