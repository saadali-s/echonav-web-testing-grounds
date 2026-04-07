import { AuthService } from '@/lib/services/AuthService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { inviteCode, password, displayName } = await request.json();
    
    if (!inviteCode || !password || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await AuthService.activateStaff(inviteCode, password, displayName);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}