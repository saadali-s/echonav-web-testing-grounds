"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NextLink from "next/link";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AuthForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "login";

  // --- FORM STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup State
  const [instName, setInstName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTabChange = (value: string) => {
    setError(""); // Clear errors when switching tabs
    router.push(`/auth?tab=${value}`);
  };

  // --- LOGIN LOGIC ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        login(); // Update your AuthProvider state
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to log in");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SIGNUP LOGIC ---
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institution: instName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.confirmationRequired) {
          // STAY on page and show message so user can go confirm manually
          setSuccessMessage(data.message);
          setIsLoading(false);
        } else {
          login();
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      if (!successMessage) setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-2 text-center">
        <NextLink href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/EchoNavFullLogo.svg"
            alt="EchoNav Logo"
            width={340}
            height={60}
            priority
            className="dark:invert"
          />
        </NextLink>
        <p className="text-muted-foreground font-medium tracking-tight">
          Navigate with Confidence.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 p-1 bg-secondary/50 backdrop-blur-sm rounded-xl">
          <TabsTrigger
            value="login"
            className="rounded-lg data-[state=active]:shadow-sm"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-lg data-[state=active]:shadow-sm"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Global Error Display */}
        {error && (
          <div className="mt-4 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
            {error}
          </div>
        )}

        <TabsContent value="login" className="mt-4">
          <Card className="border-border/50 shadow-xl shadow-black/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/reset-password"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="mb-3 h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {successMessage && (
          <div className="mt-4 p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center font-bold">
            {successMessage}
          </div>
        )}

        <TabsContent value="signup" className="mt-4">
          <Card className="border-border/50 shadow-xl shadow-black/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create an account
              </CardTitle>
              <CardDescription>
                Join EchoNav to start navigating with confidence.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignupSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inst-name">Institution Name</Label>
                  <Input
                    id="inst-name"
                    placeholder="e.g., University of Johannesburg"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Admin Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="admin@institution.com"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="mb-3 h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground px-8">
        By clicking continue, you agree to our{" "}
        <NextLink
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </NextLink>
        .
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Suspense
        fallback={
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        }
      >
        <AuthForm />
      </Suspense>
    </div>
  );
}
