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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";

import { useGooglePlacesAutocomplete } from "@/hooks/AutoAddressGoogleMaps";
import { COUNTRIES } from "@/lib/countries";

export function SignupForm() {
  const { register } = useAuth();

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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountryCode);
  const currentDialCode = currentCountry?.dialCode || "";
  const streetInputRef = useRef<HTMLInputElement>(null);

  useGooglePlacesAutocomplete(streetInputRef, selectedCountryCode, (details) => {
    setStreetAddress(details.streetAddress);
    setCity(details.city);
    setStateProvince(details.stateProvince);
    setPostalCode(details.postalCode);
    if (details.countryCode) {
      const matched = COUNTRIES.find((c) => c.code === details.countryCode);
      if (matched) setSelectedCountryCode(matched.code);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        orgName: instName,
        adminName: adminName,
        email: email,
        password: password,
        country: currentCountry?.name || "",
        address: `${streetAddress}, ${city}, ${stateProvince}, ${postalCode}`,
        contactNo: `${currentDialCode}${contactNumber}`,
      });
      
    } catch (err: unknown) {
      // Replaced 'any' with 'unknown' and typecast to a standard Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-500">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
          {error}
        </div>
      )}

      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
        <CardHeader className="bg-secondary/10 pb-6 border-b border-border/50">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Join EchoNav to start navigating with confidence.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="inst-name">Institution Name</Label>
              <Input id="inst-name" required value={instName} onChange={(e) => setInstName(e.target.value)} disabled={isLoading} placeholder="University of Johannesburg" className="h-10 rounded-lg bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-AdminName">Admin Name</Label>
              <Input id="signup-AdminName" required value={adminName} onChange={(e) => setAdminName(e.target.value)} disabled={isLoading} placeholder="Dr. Jane Doe" className="h-10 rounded-lg bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Admin Email</Label>
              <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} placeholder="admin@uj.ac.za" className="h-10 rounded-lg bg-secondary/30" />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-border/50 mt-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location Details</h3>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Country / Region</Label>
              <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                <PopoverTrigger asChild>
                  <Button variant="outline" disabled={isLoading} className="w-full justify-between h-10 rounded-lg bg-secondary/30">
                    {currentCountry ? currentCountry.name : "Select country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {COUNTRIES.map((country) => (
                          <CommandItem key={country.code} value={country.name} onSelect={() => { setSelectedCountryCode(country.code); setOpenCountrySelect(false); }}>
                            <Check className={cn("mr-2 h-4 w-4", selectedCountryCode === country.code ? "opacity-100" : "opacity-0")} />
                            {country.name} ({country.dialCode})
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
              <Input ref={streetInputRef} id="signup-street" required disabled={isLoading} value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="123 University Rd" className="h-10 rounded-lg bg-secondary/30" autoComplete="off" />
            </div>

            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required disabled={isLoading} className="h-10 rounded-lg bg-secondary/30" />
              <Input placeholder="State" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} required disabled={isLoading} className="h-10 rounded-lg bg-secondary/30" />
              <Input placeholder="Zip" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required disabled={isLoading} className="h-10 rounded-lg bg-secondary/30" />
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-18 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-sm font-medium border border-input/50">{currentDialCode}</div>
                <Input type="tel" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} disabled={isLoading} placeholder="11 559 1234" className="h-10 flex-1 rounded-lg bg-secondary/30" />
              </div>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-border/50 mt-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Security</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="h-10 rounded-lg bg-secondary/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="h-10 rounded-lg bg-secondary/30" />
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/5 pt-4 pb-6 mt-4 border-t border-border/50">
            <Button type="submit" disabled={isLoading} className="mt-2 w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all">
              {isLoading ? "Provisioning Organization..." : "Create account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}