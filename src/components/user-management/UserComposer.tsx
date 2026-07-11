"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { useDeleteUser, useGetPendingUserPins, useGetUsers } from "@/hooks/api/useUsers";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ActiveUserList, ActiveUsers } from "./ActiveUserList";
import { InvitedUsers, InvitedUsersList } from "./InvitedUserList";
import { InviteNewUser } from "./InviteNewUser";

export function UserComposer() {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  // Fetch the real data from Spring Boot
  const { data: usersDtoList, isLoading, isError } = useGetUsers(orgIdNum);
  const { data: pinsDtoList, isLoading: pinsLoading } = useGetPendingUserPins(orgIdNum);
  const deleteUserMutation = useDeleteUser(orgIdNum);

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Map the backend DTO to the frontend UI interface
  const activeUsers: ActiveUsers[] = (usersDtoList || []).map((user) => ({
    id: String(user.id),
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    pin: "******", // Concealed for security after generation
    generatedBy: "System Admin",
    joinedDate: "Recently",
  }));

  // Empty placeholder. Concierge pairing pins are handled directly in the modal flow.
  const invitedUsers: InvitedUsers[] = (pinsDtoList || []).map((pin) => ({
    id: String(pin.id),
    name: `${pin.firstName} ${pin.lastName}`.trim(),
    email: pin.email,
    pin: pin.pinCode,
    generatedBy: pin.generatedBy,
    invitedDate: new Date(pin.invitedDate).toLocaleDateString(),
  }));

  const handleDeleteActiveUser = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(Number(id));
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleDeleteInvitedUser = (id: string) => {
    alert(`Invited user deletion placeholder: ${id}`);
  };

  const handleAddInvitedUser = (newUser: InvitedUsers) => {
    alert(`New user invited: ${newUser.id}`);
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

        {isLoading && (
          <div className="p-8 text-center text-zinc-500 font-bold animate-pulse uppercase tracking-widest border-2 border-dashed border-zinc-300 rounded-xl">
            Loading User Directory...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-red-700 bg-red-50 border-2 border-red-500 font-bold uppercase tracking-widest rounded-xl">
            Failed to load user directory. Please check your connection.
          </div>
        )}

        {!isLoading && !isError && (
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
        )}
      </div>

      <InviteNewUser
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSendInvite={handleAddInvitedUser}
        pairingPin="" 
      />
    </div>
  );
}