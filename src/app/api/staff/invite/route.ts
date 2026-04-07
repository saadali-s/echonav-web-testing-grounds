import { AuthService } from '@/lib/services/AuthService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const profile = await AuthService.getCurrentProfile();
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    const { email, role } = await request.json();
    const result = await AuthService.inviteStaff(profile.organization_id, email, role || 'TECHNICIAN', profile.id);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}