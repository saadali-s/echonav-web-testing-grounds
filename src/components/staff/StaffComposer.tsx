import { ActiveStaff, ActiveStaffRoster } from "./ActiveStaffRoster";
import { InvitationQueue, PendingInvite } from "./InvitationQueue";
import { InviteEngine } from "./InviteEngine";
import React from "react";

// --- Mock Data ---
const mockPending: PendingInvite[] = [
  { id: "inv1", email: "j.doe@institution.edu", inviteCode: "A7X9-B2M4", status: "PENDING", expirationDate: "Tomorrow" },
  { id: "inv2", email: "t.smith@institution.edu", inviteCode: "C3V1-N8L0", status: "EXPIRED", expirationDate: "2 days ago" },
];

const mockActive: ActiveStaff[] = [
  { id: "st1", name: "Sarah Jenkins", email: "s.jenkins@institution.edu", role: "ADMIN", joinedDate: "Jan 12, 2026" },
  { id: "st2", name: "Michael Chen", email: "m.chen@institution.edu", role: "TECHNICIAN", joinedDate: "Feb 03, 2026" },
  { id: "st3", name: "Dr. Mabaso", email: "mabaso@institution.edu", role: "ADMIN", joinedDate: "Dec 05, 2025" },
];

export function StaffComposer() {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b-2 border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">Staff Management</h1>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Invite field technicians and manage institutional access.</p>
      </div>

      {/* Section 1: The Invite Engine */}
      <div className="max-w-4xl">
        <InviteEngine />
      </div>

      {/* Grid for Sections 2 & 3 - Removed h-full to prevent clipping */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <InvitationQueue invites={mockPending} />
        <ActiveStaffRoster staff={mockActive} />
      </div>
    </div>
  );
}