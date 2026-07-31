"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useDeleteStaff, useDeleteStaffInvite, useGetPendingInvites, useGetStaff } from "@/hooks/api/useStaff";
import { ActiveStaff, ActiveStaffRoster } from "./ActiveStaffRoster";
import { InvitationQueue, PendingInvite } from "./InvitationQueue";
import { InviteEngine } from "./InviteEngine";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export function StaffComposer() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  const { data: staffDtoList, isLoading, isError } = useGetStaff(orgIdNum);
  const [showError, setShowError] = useState(false);

  const { data: invitesDtoList } = useGetPendingInvites(orgIdNum);
  const deleteStaffMutation = useDeleteStaff(orgIdNum);
  const deleteStaffInviteMutation = useDeleteStaffInvite(orgIdNum);

  const activeStaff: ActiveStaff[] = (staffDtoList || []).map((staff) => ({
    id: String(staff.id),
    name: staff.email.split("@")[0],
    email: staff.email,
    role: (staff.role === "ADMIN" ? "ADMIN" : "TECHNICIAN"),
    joinedDate: staff.joinedDate || "Recently",
  }));

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
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const handleDeleteInvitedStaff = async (id: string) => {
    try {
      await deleteStaffInviteMutation.mutateAsync(Number(id));
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
  }, [isError]);

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5">
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

      <AlertDialog open={isError} onOpenChange={(open) => !open && handleCloseError}>
        <AlertDialogContent className="max-w-[400px] border-2 border-red-500 bg-red-50 p-8 text-center rounded-xl">
          <AlertDialogHeader className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-red-100 text-red-700 rounded-full">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <AlertDialogTitle className="text-red-700 font-bold uppercase tracking-widest text-sm">
              Failed to load staff directory
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs text-red-600/80 font-medium">
              We encountered a network issue trying to sync the roster. Please check your internet connection.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="sm:justify-center mt-2">
            <AlertDialogAction
              onClick={handleCloseError}
              className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-bold uppercase tracking-wider text-xs rounded-md transition-colors shadow-md"
            >
              Acknowledge & Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <InvitationQueue invites={pendingInvites} onDelete={handleDeleteInvitedStaff} />
          <ActiveStaffRoster staff={activeStaff} onDelete={handleDeleteStaff} />
        </div>
      )}
    </div>
  );
}