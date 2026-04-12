import { AuthService } from "@/lib/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, institution } = await request.json();

    const slug = institution.toLowerCase().trim().replace(/[\W_]+/g, '-');
    const adminName = email.split('@')[0];

    const result = await AuthService.registerOrganization(
      institution,
      slug,
      email,
      password,
      adminName
    );

    return NextResponse.json({ 
      success: true, 
      confirmationRequired: result.confirmationRequired,
      message: result.confirmationRequired 
        ? "Account created! Please verify your email to log in." 
        : "Signup successful!"
    }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 400 }); 
  }
}