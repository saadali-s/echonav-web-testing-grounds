"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryWarning, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface CriticalBeacon {
  id: string;
  label: string;
  battery: string;
}

export interface HardwareHealthData {
  total: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  criticalItems: CriticalBeacon[];
}

const ITEMS_PER_PAGE = 2;

export function HardwareHealthChart({
  healthData,
}: {
  healthData: HardwareHealthData;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const chartData = [
    {
      name: "Healthy (>50%)",
      value: healthData.healthyCount,
      color: "#3b82f6",
    },
    {
      name: "Warning (15-50%)",
      value: healthData.warningCount,
      color: "#fbbf24",
    },
    {
      name: "Critical (<15%)",
      value: healthData.criticalCount,
      color: "#f43f5e",
    },
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(healthData.criticalItems.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = healthData.criticalItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <Card className="relative p-0 flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">

      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-sky-300 dark:bg-sky-900 px-5 py-3 shrink-0">
        <CardTitle className="font-black uppercase tracking-wider text-sm text-sky-1050 dark:text-sky-100">
          Hardware Health
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 p-5 flex flex-col items-center">
        <div className="h-40 w-full relative mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
            <span className="text-2xl font-black text-zinc-950 dark:text-zinc-100">
              {healthData.total}
            </span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Beacons
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 border-t-2 border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black text-rose-600 dark:text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
              <BatteryWarning className="h-3.5 w-3.5" /> Critical (
              {healthData.criticalItems.length})
            </h4>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-5 w-5 rounded border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3 text-zinc-950 dark:text-white" />
              </Button>
              <span className="text-[9px] font-bold text-zinc-500 w-4 text-center">
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-5 w-5 rounded border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3 w-3 text-zinc-950 dark:text-white" />
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 min-h-17">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div
                  key={item.id}
                  className="text-[10px] font-bold flex justify-between bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200 dark:border-rose-900/30 text-zinc-800 dark:text-zinc-200"
                >
                  <span className="truncate pr-2">{item.label}</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    {item.battery}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[10px] font-bold text-center p-2 text-emerald-600 dark:text-emerald-500">
                All systems optimal.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
