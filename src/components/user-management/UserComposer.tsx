"use client"

import { useState } from "react";
import { ActiveUserList, ActiveUsers } from "./ActiveUserList";

const mockActive: ActiveUsers[] = [
  { id: "st1", name: "Elena Rostova", email: "ElenaRostova@test.edu", pin: "23445", joinedDate: "Jan 12, 2025" },
  { id: "st2", name: "Julian Vance", email: "JulianVance@test.edu", pin: "67676", joinedDate: "Feb 03, 2023" },
  { id: "st3", name: "Chloe Sterling", email: "ChloeSterling@test.edu", pin: "34596", joinedDate: "June 05, 2024" },
];

export function UserComposer() {
  // 1. Initialize state with our mock data
  const [users, setUsers] = useState<ActiveUsers[]>(mockActive);

  // 2. Delete Handler
  const handleDeleteUser = (id: string) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b-2 border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
          User Management
        </h1>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          View and manage active users.
        </p>
      </div>

      {/* Section 1: Display a list of active users */}
      <div className="max-w-full">
        {/* Pass the state and the delete handler as props */}
        <ActiveUserList users={users} onDelete={handleDeleteUser} />
      </div>
    </div>
  );
}