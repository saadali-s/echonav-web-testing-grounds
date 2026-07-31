"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteUser } from "@/hooks/api/useUsers";
import { KeyRound, MailCheck, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { InvitedUsers } from "./InvitedUserList";

interface InviteNewUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (newUser: InvitedUsers) => void;
  pairingPin: string;
}

export function InviteNewUser({ isOpen, onClose }: InviteNewUserProps) {
  const { activeOrgId, user } = useAuth();
  const inviteMutation = useInviteUser();
  const [successStatus, setSuccessStatus] = useState<
    "EMAILED" | "CONCIERGE" | null
  >(null);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [isConcierge, setIsConcierge] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setSuccessStatus(null);
    setGeneratedPin(null);
    setIsConcierge(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!firstName || !lastName || !email || !activeOrgId || !user?.id) return;

    try {
      const response = await inviteMutation.mutateAsync({
        firstName,
        lastName,
        email,
        organisationId: Number(activeOrgId),
        generatedById: Number(user.id),
        requiresConcierge: isConcierge,
      });

      if (response.pairingPin === "EMAILED") {
        setSuccessStatus("EMAILED");
      } else {
        setSuccessStatus("CONCIERGE");
        setGeneratedPin(response.pairingPin);
      }
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-5 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
            {successStatus ? (
              <MailCheck className="w-5 h-5 text-emerald-600" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
            {successStatus ? "Access Granted" : "Invite A New User"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {successStatus === "EMAILED" && (
          <div className="p-8 space-y-8 flex flex-col items-center">
            <div className="flex flex-col items-center w-full p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-center">
                Access Token Dispatched
              </p>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 text-center mt-3">
                An email containing the 6-digit access PIN has been successfully
                sent to the user.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-zinc-950 text-white font-bold h-11 uppercase tracking-widest"
            >
              Close Window
            </Button>
          </div>
        )}

        {successStatus === "CONCIERGE" && (
          <div className="p-6 space-y-8 flex flex-col items-center">
            <div className="flex flex-col items-center w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 text-center">
                Instruct the user to enter this PIN in their EchoNav mobile app.
                This code will self-destruct from the dashboard once used.
              </p>

              <div className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 w-full py-6 rounded-xl border-4 border-zinc-950 dark:border-zinc-100 mb-2 flex justify-center">
                <span className="text-5xl sm:text-6xl font-mono font-black tracking-[0.2em] ml-4">
                  {generatedPin}
                </span>
              </div>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-zinc-950 text-white font-bold h-11 uppercase tracking-widest"
            >
              Done
            </Button>
          </div>
        )}

        {!successStatus && (
          <form onSubmit={handleSubmit} className="overflow-y-auto">
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Name</Label>
                    <Input
                      id="first-name"
                      name="firstName"
                      placeholder="Elena"
                      className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                      required
                      disabled={inviteMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Surname</Label>
                    <Input
                      id="last-name"
                      name="lastName"
                      placeholder="Rostova"
                      className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                      required
                      disabled={inviteMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email">Email Address</Label>
                  <Input
                    id="user-email"
                    name="email"
                    type="email"
                    placeholder="student@institution.edu"
                    className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                    required
                    disabled={inviteMutation.isPending}
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <label className="relative flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isConcierge}
                      onChange={(e) => setIsConcierge(e.target.checked)}
                      disabled={inviteMutation.isPending}
                    />
                    <div className="h-6 w-11 rounded-full bg-zinc-200 border-2 border-zinc-300 peer-checked:bg-zinc-950 peer-checked:border-zinc-950 dark:bg-zinc-800 dark:border-zinc-700 dark:peer-checked:bg-zinc-100 dark:peer-checked:border-zinc-100 after:absolute after:top-[4px] after:left-[4px] after:h-4 after:w-4 after:rounded-full after:bg-white dark:after:bg-zinc-400 peer-checked:after:translate-x-[20px] dark:peer-checked:after:bg-zinc-950 after:transition-all"></div>
                  </label>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                      Requires Concierge Assistance
                    </span>
                    <span className="text-[10px] font-medium text-zinc-500">
                      Show PIN on screen for visually impaired users.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={inviteMutation.isPending}
                className="font-bold border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-11"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={inviteMutation.isPending}
                className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-bold h-11  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                {inviteMutation.isPending
                  ? "Generating..."
                  : "Generate & Dispatch PIN"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
