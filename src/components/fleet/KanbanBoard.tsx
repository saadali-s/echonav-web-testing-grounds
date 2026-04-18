import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, LayoutDashboard } from "lucide-react";

export interface Task {
  id: string;
  status: "TO_DO" | "IN_PROGRESS" | "VERIFIED";
  nodeLabel: string;
  staffName: string;
}

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const columns = [
    {
      id: "TO_DO",
      title: "To Do",
      bg: "bg-purple-300 dark:bg-purple-950/40",
      border: "border-purple-900 dark:border-purple-700",
      text: "text-purple-1050 dark:text-purple-500",
      dot: "bg-purple-500",
    },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      bg: "bg-amber-300 dark:bg-amber-950/40",
      border: "border-amber-900 dark:border-amber-700",
      text: "text-amber-1050 dark:text-amber-500",
      dot: "bg-amber-500",
    },
    {
      id: "VERIFIED",
      title: "Verified",
      bg: "bg-emerald-300 dark:bg-emerald-950/40",
      border: "border-emerald-900 dark:border-emerald-700",
      text: "text-emerald-1050 dark:text-emerald-500",
      dot: "bg-emerald-500",
    },
  ];

  return (
    <Card className="h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-300 dark:bg-amber-950/40 pb-4 p-5 rounded-t-lg">
        <CardTitle className="font-black uppercase tracking-wider text-sm flex items-center gap-2 text-amber-1050 dark:text-amber-500">
          <LayoutDashboard className="h-5 w-5" />
          Task Control Board
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-5 overflow-x-auto bg-white dark:bg-zinc-950">
        <div className="flex gap-5 h-full min-w-150">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex-1 flex flex-col rounded-xl border-2 ${col.border} overflow-hidden bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-none`}
              >
                <div
                  className={`p-3 border-b-2 ${col.border} flex items-center justify-between ${col.bg}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded border-2 border-current ${col.dot}`}
                    />
                    <h3
                      className={`font-black uppercase tracking-wider text-[11px] ${col.text}`}
                    >
                      {col.title}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-2 font-black text-[10px] rounded-md ${col.border} ${col.text} bg-white/50 dark:bg-black/20`}
                  >
                    {columnTasks.length}
                  </Badge>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-zinc-950 dark:text-zinc-100 shrink-0 mt-0.5" />
                        <span className="font-black text-xs text-zinc-950 dark:text-zinc-100 uppercase leading-tight">
                          {task.nodeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest border-t-2 border-zinc-100 dark:border-zinc-800 pt-2">
                        <User className="h-3 w-3" />
                        {task.staffName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
