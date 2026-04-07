import { MapStudioService } from '@/lib/services/MapStudioService';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: mapId } = await params;

    // This triggers the service to pull the relational data and bundle the JSON
    const echomapBundle = await MapStudioService.publishMap(mapId);
    
    return NextResponse.json(echomapBundle, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}