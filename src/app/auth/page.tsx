"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AuthForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "login";

  const handleTabChange = (value: string) => {
    router.push(`/auth?tab=${value}`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/dashboard");
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
            <form onSubmit={handleAuthSubmit}>
              <CardContent className="space-y-4">
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
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  Log in
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

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
            <form onSubmit={handleAuthSubmit}>
              <CardContent className="space-y-4">
                {/* Institution Name */}
                <div className="space-y-2">
                  <Label htmlFor="inst-name">Institution Name</Label>
                  <Input 
                    id="inst-name" 
                    placeholder="e.g., University of Johannesburg" 
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20" 
                    required 
                  />
                </div>

                {/* Facility Type */}
                <div className="space-y-2">
                  <Label htmlFor="facility-type">Facility Type</Label>
                  <Select required>
                    <SelectTrigger className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="mall">Shopping Mall</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="other">Other Office/Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-email">Admin Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="admin@institution.com"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="mb-3 h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  Create account
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