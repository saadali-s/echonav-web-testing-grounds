"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, X } from "lucide-react";
import { InvitedUsers } from "./InvitedUserList";

interface InviteNewUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (newUser: InvitedUsers) => void;
}

export function InviteNewUser({
  isOpen,
  onClose,
  onSendInvite,
}: InviteNewUserProps) {
  const [activePin, setActivePin] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      const mockPin = Math.floor(10000 + Math.random() * 90000).toString();
      setActivePin(mockPin);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setActivePin("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const newUser: InvitedUsers = {
      id: `inv_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email: email,
      pin: activePin,
      generatedBy: "admin@institution.edu",
      invitedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    };

    onSendInvite(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-5 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5" />
            Invite A New User
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="flex flex-col items-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
                Provide this pairing PIN
              </p>

              <div className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 w-full py-6 rounded-xl border-4 border-zinc-950 dark:border-zinc-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] mb-2 flex justify-center">
                <span className="text-5xl sm:text-6xl font-mono font-black tracking-[0.2em] ml-4">
                  {activePin}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Name</Label>
                  <Input
                    id="first-name"
                    placeholder="Elena"
                    className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Surname</Label>
                  <Input
                    id="last-name"
                    placeholder="Rostova"
                    className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="student@institution.edu"
                  className="h-11 rounded-lg bg-secondary/30 dark:bg-zinc-900 focus-visible:ring-primary/20 border-zinc-300 dark:border-zinc-800 font-medium"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-5 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="font-bold border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-bold h-11 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
