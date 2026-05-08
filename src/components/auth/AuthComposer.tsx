"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthComposer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "login";

  const handleTabChange = (value: string) => {
    router.push(`/auth?tab=${value}`);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-8 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header & Logo */}
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
        <p className="text-muted-foreground font-medium tracking-tight mt-2">
          Navigate with Confidence.
        </p>
      </div>

      {/* Tabs Control */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full flex flex-col items-center"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-secondary/50 backdrop-blur-sm rounded-xl">
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

        <TabsContent value="login" className="w-full max-w-md mt-4">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup" className="w-full mt-4">
          <SignupForm />
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground px-8 pb-8 mt-auto">
        By clicking continue, you agree to our{" "}
        <Link
          href="/#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}