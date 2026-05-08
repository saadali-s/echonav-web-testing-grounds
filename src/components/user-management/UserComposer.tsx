"use client";

import { useState } from "react";
import { ActiveUserList, ActiveUsers } from "./ActiveUserList";
import { InvitedUsersList, InvitedUsers } from "./InvitedUserList";
import { InviteNewUser } from "./InviteNewUser";
import { Button } from "../ui/button";
import { KeyRound } from "lucide-react";

const mockActive: ActiveUsers[] = [
  {
    id: "st1",
    name: "Elena Rostova",
    email: "ElenaRostova@test.edu",
    pin: "23445",
    generatedBy: "admin@institution.edu",
    joinedDate: "Jan 12, 2025",
  },
  {
    id: "st2",
    name: "Julian Vance",
    email: "JulianVance@test.edu",
    pin: "67676",
    generatedBy: "admin@institution.edu",
    joinedDate: "Feb 03, 2023",
  },
  {
    id: "st3",
    name: "Chloe Sterling",
    email: "ChloeSterling@test.edu",
    pin: "34596",
    generatedBy: "s.jenkins@institution.edu",
    joinedDate: "June 05, 2024",
  },
];

const mockInvited: InvitedUsers[] = [
  {
    id: "inv1",
    name: "Marcus Thorne",
    email: "MarcusThorne@test.edu",
    pin: "88990",
    generatedBy: "admin@institution.edu",
    invitedDate: "April 17, 2023",
  },
  {
    id: "inv2",
    name: "Sarah Lin",
    email: "SarahLin@test.edu",
    pin: "11223",
    generatedBy: "s.jenkins@institution.edu",
    invitedDate: "October 03, 2024",
  },
];

export function UserComposer() {
  const [activeUsers, setActiveUsers] = useState<ActiveUsers[]>(mockActive);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUsers[]>(mockInvited);

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleDeleteActiveUser = (id: string) => {
    setActiveUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id),
    );
  };

  const handleDeleteInvitedUser = (id: string) => {
    setInvitedUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id),
    );
  };

  const handleAddInvitedUser = (newUser: InvitedUsers) => {
    setInvitedUsers([newUser, ...invitedUsers]);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col min-h-full">
        <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
              User Management
            </h1>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
              Invite new users and view current and pending users.
            </p>
          </div>

          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0"
          >
            <KeyRound className="w-5 h-5 mr-2" />
            Invite A New User
          </Button>
        </div>

        <div className="max-w-full space-y-8">
          <ActiveUserList
            users={activeUsers}
            onDelete={handleDeleteActiveUser}
          />
          <InvitedUsersList
            users={invitedUsers}
            onDelete={handleDeleteInvitedUser}
          />
        </div>
      </div>

      <InviteNewUser
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSendInvite={handleAddInvitedUser}
      />
    </div>
  );
}
