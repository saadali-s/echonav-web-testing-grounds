'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Wrench } from "lucide-react";
import { useAuth } from "../layout/auth-provider";
import { useGetPendingInvites, useAcceptInvite } from "@/hooks/api/useStaff";

export default function LandingPage() {
    const router = useRouter();
    const { activeOrgId } = useAuth();
    const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

    const { data: staff = [], isLoading } = useGetPendingInvites(orgIdNum);
    const acceptMutation = useAcceptInvite(orgIdNum);

    const [showTechPopup, setShowTechPopup] = useState(false);

    const invitationToAccept = staff.find((member) => member.status === "PENDING");

    const handleAcceptInvite = () => {
        if (!invitationToAccept) return;

        const userRole = invitationToAccept.role;

        acceptMutation.mutate(
            {
                staffId: invitationToAccept.id,
                payload: {
                    role: userRole,
                    email: invitationToAccept.email,
                },
            },
            {
                onSuccess: () => {
                    if (userRole === "ADMIN") {
                        router.push("/dashboard");
                    } else if (userRole === "TECHNICIAN") {
                        setShowTechPopup(true);
                    }
                },
                onError: (err) => {
                    alert(`Could not update system status: ${err.message || "Your have been uninvited"}`);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center p-6 antialiased relative">
            {!showTechPopup && (
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="space-y-3">
                        <h1 className="text-[42px] sm:text-[50px] font-black tracking-tight uppercase leading-[0.95] text-zinc-950 dark:text-zinc-50">
                            READY TO BE PART OF ECHONAV?
                        </h1>
                        {invitationToAccept && (
                            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                                Assigned Role: <span className="text-indigo-600 dark:text-indigo-400 font-mono">{invitationToAccept.role}</span>
                            </p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="button"
                            disabled={!invitationToAccept || acceptMutation.isPending}
                            onClick={handleAcceptInvite}
                            className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 font-black text-xs uppercase tracking-widest h-12 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] disabled:opacity-50"
                        >
                            {acceptMutation.isPending ? (
                                <>
                                    Updating Account Status...
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Accept Invitation
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        {!invitationToAccept && (
                            <p className="text-xs text-red-500 font-bold uppercase tracking-wider mt-4">
                                No pending invitations discovered for this profile window.
                            </p>
                        )}
                    </div>
                </div>
            )}
            {showTechPopup && (
                <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="max-w-sm w-full border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] rounded-xl overflow-hidden">
                        <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-300 dark:bg-amber-950/40 py-4">
                            <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-amber-950 dark:text-amber-400">
                                <Wrench className="h-4 w-4" />
                                Technician Profile Activated
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Your status has been updated to <span className="font-bold text-zinc-950 dark:text-zinc-50">ACTIVE</span> in the EchoNav infrastructure tracking network database. You can now configure your mobile terminal devices.
                            </p>
                            <Button
                                type="button"
                                onClick={() => router.push("/terminal-download")}
                                className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 font-black text-xs uppercase tracking-widest h-10 border-2 border-zinc-950"
                            >
                                Acknowledge & Close
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}