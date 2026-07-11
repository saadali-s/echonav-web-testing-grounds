"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteStaff } from "@/hooks/api/useStaff";
import { Mail, Send, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { EmailComposer } from "./EmailComposer";
import { useAuth } from "../layout/auth-provider";

export function InviteEngine() {
  const { user, activeOrgId } = useAuth();
  const orgId = activeOrgId ? Number(activeOrgId) : undefined;
  const { mutateAsync: inviteStaff, isPending } = useInviteStaff();
  
  // State for all 3 fields
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !displayName || !role || !orgId || !user) {
      alert("Please fill in all fields and ensure you are logged in.");
      return;
    }
    setIsSendingEmail(true);
    try {
      const backendUpdate = await inviteStaff({
        email: email,
        name: displayName,
        organisationId: orgId,
        invitedById: Number(user.id),
        role: role as "ADMIN" | "TECHNICIAN" // Dynamic role selection restored!
      });

      const sendEmail = await EmailComposer(backendUpdate);
      if (!sendEmail.success) {
        alert(`Error in sending the email: ${sendEmail.error}`);
        return;
      }
      
      alert("Invitation successfully processed and emailed!");
      setEmail("");
      setDisplayName("");
      setRole("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong processing the invitation.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const isLoading = isPending || isSendingEmail;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 flex items-center gap-2 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-y-0.5 active:translate-x-0.5">
          <UserPlus className="h-5 w-5" />
          Invite Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden rounded-xl sm:max-w-[550px]">
        <DialogHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-300 dark:bg-indigo-950/40 py-5 px-8">
          <DialogTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-zinc-950 dark:text-indigo-500">
            <UserPlus className="h-5 w-5" />
            Staff Invitation Engine
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col gap-6">
            
            {/* Display Name Input */}
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  className="pl-12 w-full border-2 border-zinc-950 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-indigo-400 dark:focus-visible:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 h-12 text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            {/* Email & Role Grid row to keep layout balanced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Role Selection (Takes 1 column) */}
              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
                  Assign Role
                </label>
                <Select value={role} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger className="w-full border-2 border-zinc-950 dark:border-zinc-800 focus:ring-0 focus:ring-offset-0 focus:border-indigo-400 dark:focus:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 h-12 text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none font-bold">
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input (Takes 2 columns) */}
              <div className="space-y-3 sm:col-span-2">
                <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="staff.name@institution.edu"
                    className="pl-12 w-full border-2 border-zinc-950 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-indigo-400 dark:focus-visible:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 h-12 text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer & Action Area */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-center sm:text-left max-w-[200px]">
                * Invites expire automatically after 48 hours.
              </p>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:translate-x-0.5 shrink-0 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Invite"}
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}