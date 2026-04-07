import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export interface PendingInvite {
  id: string;
  email: string;
  inviteCode: string;
  status: "PENDING" | "EXPIRED";
  expirationDate: string;
}

export function InvitationQueue({ invites }: { invites: PendingInvite[] }) {
  return (
    <Card className="border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
          <Clock className="h-4 w-4 text-zinc-400" />
          Invitation Queue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto">
        {invites.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm font-medium">No pending invitations.</div>
        ) : (
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 px-6 py-3 border-b-2 border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Email Address</span>
              <span>Invite Code</span>
              <span>Expires</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {invites.map(invite => (
                <div key={invite.id} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 truncate">{invite.email}</span>
                  <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 tracking-tighter bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded w-fit">{invite.inviteCode}</span>
                  <span className="text-xs font-medium text-zinc-500">{invite.expirationDate}</span>
                  <div className="text-right">
                    <Badge 
                      variant={invite.status === "PENDING" ? "outline" : "secondary"} 
                      className={`text-[9px] font-bold uppercase tracking-widest ${
                        invite.status === "PENDING" 
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-500 dark:border-emerald-900/50" 
                        : "opacity-60"
                      }`}
                    >
                      {invite.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}