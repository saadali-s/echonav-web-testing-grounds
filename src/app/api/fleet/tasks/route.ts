import { FleetService } from '@/lib/services/FleetService';
import { NextResponse } from 'next/server';

// GET: Fetches tasks for the logged-in staff member
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) return NextResponse.json({ error: 'staffId is required' }, { status: 400 });

    const tasks = await FleetService.getStaffTasks(staffId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Admins use this to bulk-assign nodes to a technician
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { organizationId, mapId, nodeIds, staffId } = body;

    await FleetService.createDeploymentTasks(organizationId, mapId, nodeIds, staffId);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}