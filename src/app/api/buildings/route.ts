import { MapStudioService } from '@/lib/services/MapStudioService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Allows the mobile app to hit /api/buildings?public=true
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    const buildings = await MapStudioService.getBuildings(isPublic);
    return NextResponse.json(buildings, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}