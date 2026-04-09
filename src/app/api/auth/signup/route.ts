import { AuthService } from "@/lib/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(request : Request) {
    try {
        const { email, password, institution } = await request.json();

        if (!email || !password || !institution){
            return NextResponse.json(
                { error : 'Institution name, email and password are required' },
                { status : 400}
            );
        }

        const slug = institution.toLowerCase().trim().replace(/[\W_]+/g, '-');
        const adminName = email.split('@')[0];

        const result = await AuthService.registerOrganization(
            institution,
            slug,
            email,
            password,
            adminName
        );

        // --- ADD THIS LINE BELOW ---
        // Without this, the frontend "isLoading" state will never turn off!
        return NextResponse.json({ 
            success: true, 
            organizationId: result.organizationId 
        }, { status: 201 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 400 }); // Changed 401 to 400 (Bad Request)
  }
}