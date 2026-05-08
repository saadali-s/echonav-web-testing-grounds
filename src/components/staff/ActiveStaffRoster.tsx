import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Trash2 } from "lucide-react";

export interface ActiveStaff {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN";
  joinedDate: string;
}

interface ActiveStaffRosterProps {
  staff: ActiveStaff[];
  onDelete: (id: string) => void;
}

export function ActiveStaffRoster({ staff, onDelete }: ActiveStaffRosterProps) {
  return (
    <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-emerald-300 dark:bg-emerald-950/40 py-5">
        <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-emerald-1050 dark:text-emerald-500">
          <ShieldCheck className="h-5 w-5" />
          Active Staff Roster
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto flex-1">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_80px] gap-4 px-6 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest bg-zinc-50/50 dark:bg-zinc-900/50">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span className="text-right">Joined</span>
            <span className="text-center">Remove</span>
          </div>

          <div className="flex flex-col">
            {staff.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
                No active staff found.
              </div>
            ) : (
              staff.map((member, index) => {
                const isLast = index === staff.length - 1;
                return (
                  <div
                    key={member.id}
                    className={`grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_80px] gap-4 px-6 py-5 items-center hover:bg-emerald-300/20 dark:hover:bg-emerald-950/20 transition-colors ${!isLast ? "border-b border-zinc-200 dark:border-zinc-800" : ""}`}
                  >
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 truncate">
                      {member.name}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate tracking-wide">
                      {member.email}
                    </span>
                    <div>
                      <Badge
                        variant="default"
                        className={`text-[10px] font-black uppercase tracking-widest border px-2 py-1 ${
                          member.role === "ADMIN"
                            ? "bg-indigo-100 border-indigo-300 text-indigo-900 dark:bg-indigo-900/50 dark:border-indigo-700 dark:text-indigo-100"
                            : "bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 text-right uppercase tracking-wider">
                      {member.joinedDate}
                    </span>

                    {/* Delete Action Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => onDelete(member.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Remove Staff"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
