import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffDto } from "@/lib/api/types";
import { Clock, Trash2 } from "lucide-react";

interface InvitationQueueProps {
  invites: StaffDto[];
  onDelete: (id: number) => void;
}

export function InvitationQueue({ invites = [], onDelete }: InvitationQueueProps) {

  const pendingStaff = invites.filter((member) => member.status === "PENDING");

  return (
    <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-300 dark:bg-amber-950/40 py-5">
        <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-amber-1050 dark:text-amber-500">
          <Clock className="h-5 w-5" />
          Invitation Queue
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto flex-1">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_80px] gap-4 px-6 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest bg-zinc-50/50 dark:bg-zinc-900/50">
            <span>Email Address</span>
            <span>Invite Code</span>
            <span>Expires</span>
            <span className="text-right">Status</span>
            <span className="text-center">Remove</span>
          </div>

          <div className="flex flex-col">
            {pendingStaff.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-sm font-black uppercase tracking-widest">
                No pending invitations.
              </div>
            ) : (
              pendingStaff.map((invite, index) => {
                const isLast = index === pendingStaff.length - 1;
                return (
                  <div
                    key={invite.id}
                    className={`grid grid-cols-[1.5fr_1fr_1fr_0.8fr_80px] gap-4 px-6 py-5 items-center hover:bg-amber-300/20 dark:hover:bg-amber-950/20 transition-colors ${!isLast ? "border-b border-zinc-200 dark:border-zinc-800" : ""}`}
                  >
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 truncate">
                      {invite.email}
                    </span>
                    <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-300 tracking-widest bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-md w-fit">
                      {invite.inviteCode || "N/A"}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {invite.expirationDate ? new Date(invite.expirationDate).toLocaleDateString() : "Never"}
                    </span>
                    <div className="text-right">
                      <Badge
                        variant={invite.status === "PENDING" ? "default" : "secondary"}
                        className={`text-[10px] font-black uppercase tracking-widest border px-2 py-1 ${invite.status === "PENDING"
                            ? "bg-amber-200 text-amber-900 border-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-700"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 shadow-none"
                          }`}
                      >
                        {invite.status}
                      </Badge>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => onDelete(Number(invite.id))}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Remove Invitation"
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