import { NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/services/AuthService';

export async function POST() {
  try {
    // 1. Verify the staff member is logged in and authorized
    const profile = await AuthService.getCurrentProfile();
    
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }
    if (profile.role !== 'ADMIN' && profile.role !== 'TECHNICIAN') {
      return NextResponse.json({ error: 'Forbidden. Insufficient permissions.' }, { status: 403 });
    }

    // 2. Hand off the heavy lifting to the Service layer
    const result = await AuthService.generatePairingPin(
      profile.organization_id, 
      profile.id
    );

    // 3. Return the generated PIN to the Web UI
    return NextResponse.json(result, { status: 201 });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}