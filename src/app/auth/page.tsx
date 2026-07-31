"use client";

import { AuthComposer } from "@/components/auth/AuthComposer";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-start justify-center p-4 bg-linear-to-b from-background to-secondary/20">
      <Suspense
        fallback={
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        }
      >
        <AuthComposer />
      </Suspense>
    </div>
  );
}