import { FleetService } from '@/lib/services/FleetService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('organizationId');

    if (!orgId) return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });

    const overview = await FleetService.getOverview(orgId);
    return NextResponse.json(overview, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}