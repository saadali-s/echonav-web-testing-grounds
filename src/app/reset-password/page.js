"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect reset password logic
    alert("Reset link sent (demo)");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      {/* Container */}
      <div className="flex flex-col items-center gap-8 w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">EchoNav</h1>
          <p className="text-muted-foreground font-medium tracking-tight">
            Reset your password
          </p>
        </div>

        {/* Card */}
        <Card className="w-full border-border/50 shadow-xl shadow-black/5">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Forgot password?
            </CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Send reset link
              </Button>

              {/* Back to login */}
              <Link
                href="/auth?tab=login"
                className="text-xs text-primary hover:underline font-medium"
              >
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
