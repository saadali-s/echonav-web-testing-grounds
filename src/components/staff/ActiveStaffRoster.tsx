import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export interface ActiveStaff {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN";
  joinedDate: string;
}

export function ActiveStaffRoster({ staff }: { staff: ActiveStaff[] }) {
  return (
    <Card className="border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Active Staff Roster
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[550px]">
          <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr] gap-4 px-6 py-3 border-b-2 border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span className="text-right">Joined</span>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {staff.map(member => (
              <div key={member.id} className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr] gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 truncate">{member.name}</span>
                <span className="text-xs font-medium text-zinc-500 truncate">{member.email}</span>
                <div>
                  <Badge 
                    variant={member.role === "ADMIN" ? "default" : "secondary"} 
                    className="text-[9px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none"
                  >
                    {member.role}
                  </Badge>
                </div>
                <span className="text-[11px] font-medium text-zinc-500 text-right">{member.joinedDate}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}