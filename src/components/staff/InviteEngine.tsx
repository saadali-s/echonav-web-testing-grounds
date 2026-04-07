"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Send, UserPlus } from "lucide-react";
import { useState } from "react";

export function InviteEngine() {
  const [email, setEmail] = useState("");

  return (
    <Card className="border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden rounded-xl">
      <CardHeader className="border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
          <UserPlus className="h-4 w-4 text-zinc-500" />
          The Invite Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Technician Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                type="email" 
                placeholder="tech.name@institution.edu" 
                className="pl-10 border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 bg-zinc-50/30 dark:bg-zinc-900/30 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button 
            disabled={!email} 
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-bold uppercase text-xs tracking-wider h-11 px-6 rounded-lg transition-transform active:scale-[0.98]"
          >
            <Send className="h-4 w-4 mr-2" />
            Generate & Send Invite
          </Button>
        </div>
        <p className="text-[10px] text-zinc-400 font-medium mt-3 ml-1 italic">
          * Invites expire automatically after 48 hours for security compliance.
        </p>
      </CardContent>
    </Card>
  );
}