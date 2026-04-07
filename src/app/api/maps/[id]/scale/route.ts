import { MapStudioService } from '@/lib/services/MapStudioService';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Pro-Tip: In Next.js 15+, params is a Promise.
    const { id: mapId } = await params;
    const body = await request.json();
    const { scaleMetersPerPixel } = body;

    if (!scaleMetersPerPixel) {
      return NextResponse.json({ error: 'scaleMetersPerPixel is required.' }, { status: 400 });
    }

    await MapStudioService.saveMapScale(mapId, scaleMetersPerPixel);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}