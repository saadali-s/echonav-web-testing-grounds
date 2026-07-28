"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityChartDto } from "@/lib/api/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const textureStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
};

// Accept the dynamic data
export function RoutingActivityChart({ data }: { data: ActivityChartDto[] }) {
  return (
    <Card className="relative p-0 flex flex-col border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl  dark:shadow-none overflow-hidden h-full">

      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-violet-400 dark:bg-violet-900 px-5 py-3 shrink-0">
        <CardTitle className="font-black uppercase text-sm tracking-wider text-violet-1050 dark:text-violet-100">
          Routing Engine Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 p-6 flex-1 min-h-0">
        <div className="w-full h-full min-h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#a1a1aa"
                opacity={0.4}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#71717a", fontWeight: "bold", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontWeight: "bold", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  color: "#fff",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  paddingTop: "10px",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                name="Active Users"
                stroke="#8b5cf6"
                strokeWidth={4}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="step"
                dataKey="hazards"
                name="Hazards"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
