import { FleetService } from '@/lib/services/FleetService';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();
    const { action, organizationId, nodeId, hardwareUuid, major, minor, beaconId, baselineRssi } = body;

    if (action === 'BIND') {
      const beacon = await FleetService.bindBeaconToNode(taskId, organizationId, nodeId, hardwareUuid, major, minor);
      return NextResponse.json(beacon, { status: 200 });
    }

    if (action === 'CALIBRATE') {
      await FleetService.calibrateBeacon(taskId, beaconId, baselineRssi);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}