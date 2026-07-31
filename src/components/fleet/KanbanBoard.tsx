"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, MapPin, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

export interface Task {
  id: string;
  status: "TO_DO" | "IN_PROGRESS" | "VERIFIED";
  nodeLabel: string;
  staffName: string;
}

const STATUS_OPTIONS: Array<"ALL" | Task["status"]> = [
  "ALL",
  "TO_DO",
  "IN_PROGRESS",
  "VERIFIED",
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Task["status"]>(
    "ALL",
  );

  const columns = [
    {
      id: "TO_DO" as const,
      title: "To Do",
      bg: "bg-purple-200 dark:bg-purple-950/40",
      border: "border-purple-300 dark:border-purple-700",
      text: "text-purple-950 dark:text-purple-400",
      dot: "bg-purple-500",
    },
    {
      id: "IN_PROGRESS" as const,
      title: "In Progress",
      bg: "bg-amber-200 dark:bg-amber-950/40",
      border: "border-amber-300 dark:border-amber-700",
      text: "text-amber-950 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    {
      id: "VERIFIED" as const,
      title: "Verified",
      bg: "bg-emerald-200 dark:bg-emerald-950/40",
      border: "border-emerald-300 dark:border-emerald-700",
      text: "text-emerald-950 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
  ];

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : task.status === statusFilter;
      const matchesQuery =
        !q ||
        task.nodeLabel.toLowerCase().includes(q) ||
        task.staffName.toLowerCase().includes(q) ||
        task.id.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [tasks, query, statusFilter]);

  return (
    <Card className="h-full p-0 min-h-0 flex flex-col rounded-3xl border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-300 dark:bg-amber-950/40 p-5 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="font-black uppercase tracking-widest text-xl flex items-center gap-3 text-zinc-950 dark:text-amber-400">
              <LayoutDashboard className="h-6 w-6" />
              Task Control Board
            </CardTitle>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = statusFilter === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`rounded-full border-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-black transition-all ${
                      active
                        ? "border-zinc-950 bg-zinc-950 text-white  dark:border-zinc-100 dark:bg-zinc-950 dark:text-zinc-50 "
                        : "border-zinc-950/20 bg-white/50 text-zinc-700 hover:border-zinc-950 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {opt === "ALL" ? "All Tracks" : opt.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative max-w-2xl">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search specific nodes, staff members, or task IDs..."
                className="w-full rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-12 pr-4 py-4 text-sm font-bold text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 outline-none focus:border-indigo-500 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-400 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
              Showing {filteredTasks.length} of {tasks.length} Active
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-5 md:p-8 bg-zinc-50 dark:bg-zinc-950 overflow-x-auto">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 min-w-225 h-full min-h-0">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status === col.id,
            );

            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-3xl border-2 ${col.border} overflow-hidden bg-white dark:bg-zinc-950 h-full  dark:shadow-none`}
              >
                <div
                  className={`p-5 border-b-2 ${col.border} flex items-center justify-between ${col.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full border-2 border-zinc-950 dark:border-current ${col.dot}`}
                    />
                    <h3
                      className={`font-black uppercase tracking-wider text-sm ${col.text}`}
                    >
                      {col.title}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-2 font-black text-xs rounded-full px-3 py-1 ${col.border} ${col.text} bg-white/60 dark:bg-zinc-950/60`}
                  >
                    {columnTasks.length}
                  </Badge>
                </div>

                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-white dark:bg-zinc-950 custom-scrollbar">
                  {columnTasks.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                      Queue Empty
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border-2 border-zinc-950 dark:border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 hover: dark:hover:shadow-none cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin className="h-5 w-5 text-zinc-400 dark:text-zinc-100 shrink-0 mt-0.5" />
                          <div className="font-black text-base text-zinc-950 dark:text-zinc-50 uppercase leading-tight">
                            {task.nodeLabel}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest border-t-2 border-zinc-100 dark:border-zinc-800 pt-3">
                          <User className="h-4 w-4" />
                          {task.staffName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
