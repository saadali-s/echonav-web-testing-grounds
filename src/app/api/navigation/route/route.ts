import { PathfindingService } from '@/lib/services/PathfindingService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mapId, startNodeId, destinationNodeId } = body;

    // Validate incoming Expo app request
    if (!mapId || !startNodeId || !destinationNodeId) {
      return NextResponse.json(
        { error: 'mapId, startNodeId, and destinationNodeId are required to calculate a route.' }, 
        { status: 400 }
      );
    }

    // Hand off to the Dijkstra engine
    const flightPlan = await PathfindingService.generateRoute(mapId, startNodeId, destinationNodeId);
    
    // Return the sequential array to the mobile app
    return NextResponse.json({ flightPlan }, { status: 200 });
    
  } catch (error: unknown) {
    // If Dijkstra's throws "No safe path found", it is caught here and returned as a 400
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}