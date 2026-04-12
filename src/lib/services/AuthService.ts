import { Profile } from "@/lib/models/Identity";
import { createClient } from "@/lib/supabase/server";
import { Session, User } from "@supabase/supabase-js";
import crypto from "crypto";

export class AuthService {
  /**
   * Universal Helper: Hashes a string using SHA-256.
   * This ensures the 6-digit PIN is never stored in plaintext.
   */
  private static hashString(input: string): string {
    return crypto.createHash("sha256").update(input).digest("hex");
  }

  /**
   * 1. Get Current Staff Member
   * Used to verify that the person requesting a PIN is actually logged in.
   */
  static async getCurrentProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    // Fetch the custom profile data tied to this auth user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;
    return profile as Profile;
  }

  /**
   * 2. The "PsyCaD Panic Button" Logic
   * Generates a 6-digit PIN, hashes it, and stores it with a 5-minute TTL.
   */
  static async generatePairingPin(
    organizationId: string,
    staffProfileId: string,
  ): Promise<{ pinId: string; rawPin: string; expiresAt: string }> {
    const supabase = await createClient();

    // Generate a secure 6-digit PIN (e.g., "048291")
    const rawPin = Math.floor(100000 + Math.random() * 900000).toString();
    const pinHash = this.hashString(rawPin);

    // Insert into the database (expires_at is handled natively by the SQL default)
    const { data, error } = await supabase
      .from("pairing_pins")
      .insert({
        organization_id: organizationId,
        generated_by_profile_id: staffProfileId,
        pin_hash: pinHash,
        status: "ACTIVE",
      })
      .select("id, expires_at")
      .single();

    if (error) throw new Error(`Failed to generate PIN: ${error.message}`);

    // Return the RAW pin so the UI can display it to the staff member,
    // but the database only holds the hash.
    return {
      pinId: data.id,
      rawPin: rawPin,
      expiresAt: data.expires_at,
    };
  }

  /**
   * 3. The Security Handshake (Mobile App Device Pairing)
   * Exchanges the 6-digit PIN for a permanent paired device record.
   */
  static async consumePinAndPairDevice(
    rawPin: string,
    appInstallationId: string,
    deviceModel: string,
  ): Promise<{ deviceId: string; deviceSecret: string }> {
    const supabase = await createClient();
    const pinHash = this.hashString(rawPin);

    // 1. Find an ACTIVE pin that matches the hash and HAS NOT EXPIRED
    const { data: pinRecord, error: fetchError } = await supabase
      .from("pairing_pins")
      .select("*")
      .eq("pin_hash", pinHash)
      .eq("status", "ACTIVE")
      .gte("expires_at", new Date().toISOString()) // Natively checks TTL
      .single();

    if (fetchError || !pinRecord) {
      throw new Error("Invalid or expired PIN.");
    }

    // 2. Create the Paired Device record
    const deviceSecret = crypto.randomBytes(32).toString("hex");
    const deviceSecretHash = this.hashString(deviceSecret);

    const { data: deviceRecord, error: deviceError } = await supabase
      .from("paired_devices")
      .insert({
        organization_id: pinRecord.organization_id,
        app_installation_id: appInstallationId,
        device_model: deviceModel,
        device_secret_hash: deviceSecretHash,
        status: "ACTIVE",
      })
      .select("id")
      .single();

    if (deviceError) throw new Error("Failed to register device.");

    // 3. Mark the PIN as CONSUMED so it cannot be used again
    await supabase
      .from("pairing_pins")
      .update({
        status: "CONSUMED",
        consumed_at: new Date().toISOString(),
        consumed_by_device_id: deviceRecord.id,
      })
      .eq("id", pinRecord.id);

    // Return the secret token to the mobile app
    return {
      deviceId: deviceRecord.id,
      deviceSecret: deviceSecret,
    };
  }

  /**
   * 4. Staff Login
   * Next semester, this will hash the password via BCrypt and return a Spring Boot JWT.
   */
  static async loginStaff(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: Session | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(`Login failed: ${error.message}`);
    return data;
  }

  /**
   * 5. Register Organization (Master Tenant Setup)
   * Creates the University workspace and the first Admin account.
   */
  static async registerOrganization(
    orgName: string,
    slug: string,
    adminEmail: string,
    adminPassword: string,
    adminName: string,
  ): Promise<{ organizationId: string; adminId: string; confirmationRequired: boolean }> {
    const supabase = await createClient();

    // 1. Create the Organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: orgName, slug })
      .select("id")
      .single();

    if (orgError) throw new Error(`Failed to create organization: ${orgError.message}`);

    // 2. Register User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          display_name: adminName,
        },
      },
    });

    if (authError) throw new Error(`Supabase refused to create user: ${authError.message}`);
    if (!authData.user) throw new Error("No user data returned.");

    // 3. Create the Profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      organization_id: org.id,
      email: adminEmail,
      display_name: adminName,
      role: "ADMIN",
      status: "ACTIVE",
    });

    if (profileError) console.error("Profile creation delay:", profileError.message);

    return { 
      organizationId: org.id, 
      adminId: authData.user.id, 
      confirmationRequired: !authData.session 
    };
  }

  /**
   * 6. Generate Staff Invite (The Invite Engine)
   */
  static async inviteStaff(
    orgId: string,
    email: string,
    role: "ADMIN" | "TECHNICIAN",
    inviterId: string,
  ): Promise<{ invite_code: string; expires_at: string }> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("staff_invites")
      .insert({
        organization_id: orgId,
        email: email,
        role: role,
        generated_by_profile_id: inviterId,
      })
      .select("invite_code, expires_at")
      .single();

    if (error) throw new Error(`Invite generation failed: ${error.message}`);
    return data as { invite_code: string; expires_at: string };
  }

  /**
   * 7. Activate Staff Account
   * Uses the 8-character code to create the permanent account.
   */
  static async activateStaff(
    inviteCode: string,
    password: string,
    displayName: string,
  ): Promise<{ success: boolean; profileId: string }> {
    const supabase = await createClient();

    // 1. Validate the invite
    const { data: invite, error: inviteError } = await supabase
      .from("staff_invites")
      .select("*")
      .eq("invite_code", inviteCode)
      .eq("status", "PENDING")
      .gte("expires_at", new Date().toISOString())
      .single();

    if (inviteError || !invite)
      throw new Error("Invalid or expired invite code.");

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invite.email,
      password: password,
    });

    if (authError || !authData.user)
      throw new Error("Failed to register account credentials.");

    // 3. Create the Profile
    await supabase.from("profiles").insert({
      id: authData.user.id,
      organization_id: invite.organization_id,
      email: invite.email,
      display_name: displayName,
      role: invite.role,
      status: "ACTIVE",
    });

    // 4. Burn the invite code
    await supabase
      .from("staff_invites")
      .update({ status: "USED" })
      .eq("invite_code", inviteCode);

    return { success: true, profileId: authData.user.id };
  }
}
