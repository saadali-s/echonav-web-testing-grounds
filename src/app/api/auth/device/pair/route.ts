import { AuthService } from '@/lib/services/AuthService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON from the Expo app
    const body = await request.json();
    const { pin, appInstallationId, deviceModel } = body;

    // 2. Validate input
    if (!pin || !appInstallationId) {
      return NextResponse.json(
        { error: 'Missing required fields: pin and appInstallationId are required.' }, 
        { status: 400 }
      );
    }

    // 3. Hand off to the Service layer to execute the TTL math and DB updates
    const result = await AuthService.consumePinAndPairDevice(
      pin, 
      appInstallationId, 
      deviceModel || 'Unknown Device'
    );

    // 4. Return the permanent device secret to the phone
    return NextResponse.json(result, { status: 200 });

  } catch (error: unknown) {
    // If the AuthService throws an "Invalid or expired PIN" error, it is caught here
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}