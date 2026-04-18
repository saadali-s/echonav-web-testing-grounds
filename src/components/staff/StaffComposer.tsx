"use client";

import { useState } from "react";
import { ActiveStaff, ActiveStaffRoster } from "./ActiveStaffRoster";
import { InvitationQueue, PendingInvite } from "./InvitationQueue";
import { InviteEngine } from "./InviteEngine";

// --- Mock Data ---
const mockPending: PendingInvite[] = [
  {
    id: "inv1",
    email: "j.doe@institution.edu",
    inviteCode: "A7X9-B2M4",
    status: "PENDING",
    expirationDate: "Tomorrow",
  },
  {
    id: "inv2",
    email: "t.smith@institution.edu",
    inviteCode: "C3V1-N8L0",
    status: "EXPIRED",
    expirationDate: "2 days ago",
  },
];

const mockActive: ActiveStaff[] = [
  {
    id: "st1",
    name: "Sarah Jenkins",
    email: "s.jenkins@institution.edu",
    role: "ADMIN",
    joinedDate: "Jan 12, 2026",
  },
  {
    id: "st2",
    name: "Michael Chen",
    email: "m.chen@institution.edu",
    role: "TECHNICIAN",
    joinedDate: "Feb 03, 2026",
  },
  {
    id: "st3",
    name: "Dr. Mabaso",
    email: "mabaso@institution.edu",
    role: "ADMIN",
    joinedDate: "Dec 05, 2025",
  },
];

export function StaffComposer() {
  // 1. Initialize state with mock data
  const [activeStaff, setActiveStaff] = useState<ActiveStaff[]>(mockActive);

  // 2. Create the delete handler
  const handleDeleteStaff = (id: string) => {
    setActiveStaff((currentStaff) =>
      currentStaff.filter((member) => member.id !== id),
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header Section */}
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

      {/* Section 1: The Invite Engine */}
      <div className="max-w-4xl">
        <InviteEngine />
      </div>

      {/* Grid for Sections 2 & 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <InvitationQueue invites={mockPending} />
        {/* Pass the state and the delete handler as props */}
        <ActiveStaffRoster staff={activeStaff} onDelete={handleDeleteStaff} />
      </div>
    </div>
  );
}
