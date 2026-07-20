"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authActions } from "@/lib/actions/auth";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ActivateForm() {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [token, setToken] = useState(urlToken);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successRole, setSuccessRole] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const role = await authActions.activateInvite(token, { email, name, password });
      setSuccessRole(role);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to activate account.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (successRole) {
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/EchoNavFullLogo.svg" alt="EchoNav Logo" width={240} height={40} className="dark:invert mb-4" />
        </div>
        <Card className="w-full border-2 border-emerald-500 shadow-xl shadow-emerald-500/10">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-2" />
            {successRole === "ADMIN" ? (
              <>
                <h3 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Admin Verified</h3>
                <p className="text-sm font-medium text-zinc-500">Successful login as admin. You may now log in normally to access the command center.</p>
                <Link href="/auth?tab=login" className="w-full mt-4">
                  <Button className="w-full h-12 text-base font-semibold rounded-xl bg-zinc-950 text-white">Go to Login</Button>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Technician Verified</h3>
                <p className="text-sm font-medium text-zinc-500">Successful account created. Go to the EchoNav mobile app and log in there to access your deployment tasks.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src="/EchoNavFullLogo.svg" alt="EchoNav Logo" width={240} height={40} className="dark:invert mb-4" />
      </div>

      {error && (
        <div className="w-full p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
          {error}
        </div>
      )}

      <Card className="w-full border-border/50 shadow-xl shadow-black/5">
        <CardHeader className="space-y-1 text-center border-b border-border/50 pb-6 bg-zinc-50/50 dark:bg-zinc-900/50">
          <CardTitle className="text-2xl font-bold tracking-tight">Activate Account</CardTitle>
          <CardDescription>Verify your invitation to join the staff roster.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Secure Token</Label>
              <Input required value={token} onChange={(e) => setToken(e.target.value)} disabled={!!urlToken || isLoading} className="font-mono text-xs bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label>Invited Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label>Set Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="bg-secondary/30" />
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold rounded-xl bg-zinc-950 text-white shadow-lg transition-transform active:scale-95">
              {isLoading ? "Verifying..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}