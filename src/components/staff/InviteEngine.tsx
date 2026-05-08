"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, UserPlus } from "lucide-react";
import { useState } from "react";
import { composeEmail } from "./EmailComposer";

interface InviteEngineProps {
  
}

export function InviteEngine() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("technician");

  return (
    <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden rounded-xl transition-all">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-300 dark:bg-indigo-950/40 py-5">
        <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-zinc-950 dark:text-indigo-500">
          <UserPlus className="h-5 w-5" />
          Staff Invitation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col gap-6">
          
          {/* Input Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
                Assign Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full border-2 border-zinc-950 dark:border-zinc-800 focus:ring-0 focus:ring-offset-0 focus:border-indigo-400 dark:focus:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 h-12 text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none font-bold">
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Input */}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-center sm:text-left">
              * Invites expire automatically after 48 hours for security compliance.
            </p>
            <Button
              onClick={() => {
                composeEmail({ fromEmail: "noreply@institution.edu", toEmail: email, role });
              }}
              className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0"
            >
              <Send className="h-4 w-4 mr-3" />
              Generate & Send Invite
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}