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
import { Switch } from "@/components/ui/switch"; // ADDED: Imported Switch

import { Check, ChevronsUpDown, Shield, ShieldAlert } from "lucide-react"; // ADDED: Shield icons for visual polish
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { COUNTRIES } from "@/lib/countries";

export function SignupForm() {
  const { login } = useAuth();
  
  const [instName, setInstName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRIES[0].code); 
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  
  // ADDED: State for default institution privacy
  const [defaultPrivacy, setDefaultPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountryCode);
  const currentDialCode = currentCountry?.dialCode || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    // Simulate network request
    setTimeout(() => {
      // In the real app, you will pass `defaultPrivacy` to your backend here!
      login(); 
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-500">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center font-bold">
          {successMessage}
        </div>
      )}

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/10 pb-6 border-b border-border/50">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Join EchoNav to start navigating with confidence.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-6">
            
            {/* Account Details */}
            <div className="space-y-2">
              <Label htmlFor="inst-name">Institution Name</Label>
              <Input
                id="inst-name"
                placeholder="e.g., University of Johannesburg"
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-AdminName">Admin Name</Label>
              <Input
                id="signup-AdminName"
                type="text"
                placeholder="Jane Doe"
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Admin Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="admin@institution.com"
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Divider for Address */}
            <div className="md:col-span-2 pt-2 border-t border-border/50 mt-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Location Details
              </h3>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="signup-region">Country / Region</Label>
              <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                <PopoverTrigger asChild>
                  <Button
                    id="signup-region"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCountrySelect}
                    disabled={isLoading}
                    className="w-full justify-between h-10 rounded-lg bg-secondary/30 hover:bg-secondary/80 font-normal transition-colors"
                  >
                    {currentCountry ? currentCountry.name : "Select country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {COUNTRIES.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              setSelectedCountryCode(country.code);
                              setOpenCountrySelect(false);
                            }}
                            className="cursor-pointer transition-colors aria-[selected=true]:bg-primary/10 aria-[selected=true]:text-primary aria-[selected=true]:font-medium mb-1"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountryCode === country.code ? "opacity-100 text-primary" : "opacity-0"
                              )}
                            />
                            {country.name} <span className="ml-1 text-muted-foreground aria-[selected=true]:text-primary/70">({country.dialCode})</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-street">Street Address</Label>
              <Input
                id="signup-street"
                type="text"
                placeholder="123 Main St, Suite 100"
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Address specifics */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-city">City</Label>
                <Input
                  id="signup-city"
                  type="text"
                  placeholder="City"
                  className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-state">State / Prov</Label>
                <Input
                  id="signup-state"
                  type="text"
                  placeholder="State"
                  className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-zip">Postal Code</Label>
                <Input
                  id="signup-zip"
                  type="text"
                  placeholder="Zip"
                  className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
            <div className="space-y-2">
              <Label htmlFor="signup-contact">Contact No</Label>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-[72px] shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-sm font-medium text-muted-foreground border border-input/50">
                  {currentDialCode}
                </div>
                <Input
                  id="signup-contact"
                  type="tel"
                  placeholder="000 000 0000"
                  className="h-10 flex-1 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            </div>

            {/* Divider for Security */}
            <div className="md:col-span-2 pt-2 border-t border-border/50 mt-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Security
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
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
                className="h-10 rounded-lg bg-secondary/30 focus-visible:ring-primary/20"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

          </CardContent>
          <CardFooter className="bg-secondary/5 pt-4 pb-6 mt-4 border-t border-border/50">
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