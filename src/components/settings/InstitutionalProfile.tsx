"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, Loader2 } from "lucide-react";

import { useAuth } from "@/components/layout/auth-provider"; 
import { useGetOrganisation, useUpdateOrganisation } from "@/hooks/api/useAuth";
import { OrganisationDto, UpdateOrgRequest } from "@/lib/api/types";

export function InstitutionalProfile() {
  const { user } = useAuth();
  
  // Pulling the ID from your team's specific metadata structure
  const activeOrgId = user?.user_metadata?.organization_id 
    ? parseInt(user.user_metadata.organization_id)  
    : undefined;

  const { data: orgData, isLoading } = useGetOrganisation(activeOrgId ?? 0);
  const { mutate: updateOrg, isPending } = useUpdateOrganisation();

  if (isLoading || activeOrgId === undefined) {
    return <div className="p-8 text-center text-zinc-500 font-bold uppercase tracking-wider text-sm">Loading profile...</div>;
  }

  return (
    <ProfileForm 
      activeOrgId={activeOrgId} 
      initialData={orgData} 
      updateOrg={updateOrg} 
      isPending={isPending} 
    />
  );
}

interface ProfileFormProps {
  activeOrgId: number;
  initialData?: OrganisationDto;
  updateOrg: (variables: { orgId: number; payload: UpdateOrgRequest }) => void;
  isPending: boolean;
}

function ProfileForm({ activeOrgId, initialData, updateOrg, isPending }: ProfileFormProps) {
  const [orgName, setOrgName] = useState(initialData?.orgName ?? "");
  const [adminName, setAdminName] = useState(initialData?.adminName ?? "");
  const [contactNo, setContactNo] = useState(initialData?.contactNo ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");

  const handleSave = () => {
    updateOrg({
      orgId: activeOrgId,
      payload: { orgName, contactNo, address, adminName }
    });
  };

  return (
    <Card className="rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
        <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2.5">
          <Building2 className="h-4 w-4 text-zinc-950 dark:text-zinc-100" />
          Institutional Profile
        </CardTitle>
        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
          Update registered details and infrastructure defaults.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2.5">
            <Label className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Institution Name</Label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-950" />
          </div>
          
          <div className="space-y-2.5">
            <Label className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Admin Name</Label>
            <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} className="h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-950" />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Contact Number</Label>
            <Input value={contactNo} onChange={(e) => setContactNo(e.target.value)} className="h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-950" />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Organization Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-950" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={isPending} className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-black uppercase tracking-wider h-12 px-8 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Profile</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}