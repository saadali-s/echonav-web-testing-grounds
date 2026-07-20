import { ActivateForm } from "@/components/auth/ActivateForm";
import { Suspense } from "react";

export default function ActivatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-linear-to-b from-background to-secondary/20">
      <Suspense fallback={<div className="animate-pulse">Loading secure portal...</div>}>
        <ActivateForm />
      </Suspense>
    </div>
  );
}