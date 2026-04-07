import { MapStudioService } from '@/lib/services/MapStudioService';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: mapId } = await params;
    const body = await request.json();
    const { nodes, edges } = body;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: 'Nodes and edges must be arrays.' }, { status: 400 });
    }

    await MapStudioService.saveGraph(mapId, nodes, edges);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}