"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import {Resend} from "resend";

export async function composeEmail({ fromEmail, toEmail, role }: { fromEmail: string; toEmail: string; role: string }) {
    const resend = new Resend("re_9Tezwbbd_iC1AxRJp9T9PKzMAMPonaoMB");
    const{data, error} = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: "Staff Invitation",
        html: `${<EmailComposer role={role} />}`
    });
    if (error)  {return console.error("Failed to send email:", error);}
    else {return console.log("Email sent successfully:", data);}
}

function EmailComposer({role}: {role: string}) {
    return (
        <Card className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none overflow-hidden rounded-xl transition-all">
            <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-300 dark:bg-indigo-950/40 py-5">
                <CardTitle className="text-sm font-black flex items-center gap-3 uppercase tracking-widest text-zinc-950 dark:text-indigo-500">
                    Staff Invitation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <div className="flex flex-col gap-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-zinc-950 dark:text-zinc-300 uppercase tracking-widest">
                            You have been invited to join the staff team as a {role.toUpperCase()}! Please click the button below to accept the invitation and set up your account.
                        </label>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            Click to Accept Invitation
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}