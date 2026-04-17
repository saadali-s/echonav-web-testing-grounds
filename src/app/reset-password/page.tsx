"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    // Mock API delay to test UI state
    setTimeout(() => {
      setIsSuccess(true);
      setEmail("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-linear-to-b from-background to-secondary/20">
      <div className="flex flex-col items-center gap-8 w-full max-w-105 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/EchoNavFullLogo.svg"
              alt="EchoNav Logo"
              width={340}
              height={60}
              priority
              className="dark:invert"
            />
          </Link>
          <p className="text-muted-foreground font-medium tracking-tight">
            Navigate with Confidence.
          </p>
        </div>

        <div className="w-full empty:hidden">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center -mb-4">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center -mb-4">
              If an account exists, a reset link has been sent to that email.
            </div>
          )}
        </div>

        <Card className="w-full border-border/50 shadow-xl shadow-black/5 mt-4">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-left block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>

            <CardFooter className="mt-4 flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                {isLoading ? "Sending link..." : "Send reset link"}
              </Button>

              <Link
                href="/auth?tab=login"
                className="text-sm text-primary hover:underline font-medium text-center"
              >
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground px-8">
          Need help? Contact{" "}
          <Link
            href="/support"
            className="underline underline-offset-4 hover:text-primary"
          >
            Support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}