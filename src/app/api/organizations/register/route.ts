import { AuthService } from '@/lib/services/AuthService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orgName, slug, adminEmail, adminPassword, adminName } = await request.json();
    
    const result = await AuthService.registerOrganization(orgName, slug, adminEmail, adminPassword, adminName);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}