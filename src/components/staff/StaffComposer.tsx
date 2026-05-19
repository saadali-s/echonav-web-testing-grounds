"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { useDeleteStaff, useGetPendingInvites, useGetStaff } from "@/hooks/api/useStaff";
import { ActiveStaff, ActiveStaffRoster } from "./ActiveStaffRoster";
import { InvitationQueue, PendingInvite } from "./InvitationQueue";
import { InviteEngine } from "./InviteEngine";

export function StaffComposer() {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  // Fetch the real data from Spring Boot
  const { data: staffDtoList, isLoading, isError } = useGetStaff(orgIdNum);
  const { data: invitesDtoList, isLoading: invitesLoading } = useGetPendingInvites(orgIdNum);
  const deleteStaffMutation = useDeleteStaff(orgIdNum);

  // Map the backend DTO to the frontend UI interface
  const activeStaff: ActiveStaff[] = (staffDtoList || []).map((staff) => ({
    id: String(staff.id),
    name: staff.email.split("@")[0], // Extracted from email since Staff table doesn't have names
    email: staff.email,
    role: (staff.role === "ADMIN" ? "ADMIN" : "TECHNICIAN"),
    joinedDate: staff.joinedDate || "Recently",
  }));

  // Empty placeholder until we build the GET /invites endpoint
  const pendingInvites: PendingInvite[] = (invitesDtoList || []).map((invite) => ({
    id: String(invite.id),
    email: invite.email,
    inviteCode: "PENDING", 
    status: (invite.status as "PENDING" | "EXPIRED"),
    expirationDate: new Date(invite.expirationDate).toLocaleDateString(),
  }));
  
  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaffMutation.mutateAsync(Number(id));
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleDeleteInvitedStaff = (id: string) => {
    console.log("Invite deletion will be implemented later.", id);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
            Staff Management
          </h1>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
            Invite field technicians and manage institutional access.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <InviteEngine />
      </div>

      {isLoading && (
        <div className="p-8 text-center text-zinc-500 font-bold animate-pulse uppercase tracking-widest border-2 border-dashed border-zinc-300 rounded-xl">
          Loading Staff Roster...
        </div>
      )}

      {isError && (
        <div className="p-8 text-center text-red-700 bg-red-50 border-2 border-red-500 font-bold uppercase tracking-widest rounded-xl">
          Failed to load staff directory. Please check your connection.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <InvitationQueue invites={pendingInvites} onDelete={handleDeleteInvitedStaff} />
          <ActiveStaffRoster staff={activeStaff} onDelete={handleDeleteStaff} />
        </div>
      )}
    </div>
  );
}