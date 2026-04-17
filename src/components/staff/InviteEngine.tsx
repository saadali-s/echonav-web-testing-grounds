"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Send, UserPlus } from "lucide-react";
import { useState } from "react";

export function InviteEngine() {
  const [email, setEmail] = useState("");

  return (
    <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden rounded-xl transition-all">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-100 dark:bg-indigo-950/40 py-5">
        <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-indigo-950 dark:text-indigo-500">
          <UserPlus className="h-5 w-5" />
          The Invite Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="space-y-3 flex-1 w-full">
            <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
              Technician Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
              <Input 
                type="email" 
                placeholder="tech.name@institution.edu" 
                className="pl-12 border-2 border-zinc-950 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-indigo-400 dark:focus-visible:border-indigo-500 bg-zinc-50 dark:bg-zinc-900 h-12 text-sm font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button 
            disabled={!email} 
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-xs tracking-widest h-12 px-8 border-2 border-zinc-950 dark:border-transparent rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:active:translate-x-0"
          >
            <Send className="h-4 w-4 mr-3" />
            Generate & Send Invite
          </Button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-4 uppercase tracking-wider">
          * Invites expire automatically after 48 hours for security compliance.
        </p>
      </CardContent>
    </Card>
  );
}