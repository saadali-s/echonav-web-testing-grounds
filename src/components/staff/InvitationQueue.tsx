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
    <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl overflow-hidden h-full">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-100 dark:bg-amber-950/40 py-5">
        <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-amber-950 dark:text-amber-500">
          <Clock className="h-5 w-5" />
          Invitation Queue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto">
        {invites.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-sm font-black uppercase tracking-widest">
            No pending invitations.
          </div>
        ) : (
          <div className="min-w-125">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest bg-zinc-50/50 dark:bg-zinc-900/50">
              <span>Email Address</span>
              <span>Invite Code</span>
              <span>Expires</span>
              <span className="text-right">Status</span>
            </div>
            <div className="flex flex-col">
              {invites.map((invite, index) => {
                const isLast = index === invites.length - 1;
                return (
                  <div 
                    key={invite.id} 
                    className={`grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 px-6 py-5 items-center hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors ${!isLast ? 'border-b border-zinc-200 dark:border-zinc-800' : ''}`}
                  >
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 truncate">{invite.email}</span>
                    <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-300 tracking-widest bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-md w-fit">
                      {invite.inviteCode}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{invite.expirationDate}</span>
                    <div className="text-right">
                      <Badge 
                        variant={invite.status === "PENDING" ? "default" : "secondary"} 
                        className={`text-[10px] font-black uppercase tracking-widest border px-2 py-1 ${
                          invite.status === "PENDING" 
                          ? "bg-amber-200 text-amber-900 border-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-700" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 shadow-none"
                        }`}
                      >
                        {invite.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}