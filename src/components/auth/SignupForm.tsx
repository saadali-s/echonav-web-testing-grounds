"use client";

import { useAuth } from "@/components/layout/auth-provider";
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
import { useState } from "react";

export function SignupForm() {
  const { login } = useAuth();
  
  const [instName, setInstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    // Simulate network request
    setTimeout(() => {
      login(); // AuthProvider sets the cookie and routes to /dashboard
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Local Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Local Success Display */}
      {successMessage && (
        <div className="p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center font-bold">
          {successMessage}
        </div>
      )}

      <Card className="border-border/50 shadow-xl shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Join EchoNav to start navigating with confidence.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Admin Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="admin@institution.com"
                className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                className="h-11 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
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
    </div>
  );
}