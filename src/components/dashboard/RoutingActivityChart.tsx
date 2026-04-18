"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const data = [
  { date: "04/13", users: 22, Hazards: 4 },
  { date: "04/14", users: 20, Hazards: 4 },
  { date: "04/15", users: 16, Hazards: 6 },
  { date: "04/16", users: 27, Hazards: 7 },
  { date: "04/17", users: 30, Hazards: 5 },
  { date: "04/18", users: 8, Hazards: 6 },
];

const textureStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
};

export function RoutingActivityChart() {
  return (
    <Card className="relative flex flex-col border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden h-full">
      <div
        className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none"
        style={textureStyle}
      />

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
                dataKey="Hazards"
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
