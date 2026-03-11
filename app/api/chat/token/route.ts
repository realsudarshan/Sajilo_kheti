// FRONTEND: app/api/chat/token/route.ts

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse }      from 'next/server';
import { StreamChat }        from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);
// ... imports
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const name = user?.fullName ?? user?.firstName ?? 'User';
    const image = user?.imageUrl ?? '';

    // MANDATORY FIX: Add prefix to bypass "Deleted User" error (Code 16)
    const streamUserId = `sk_${userId}`; 

    // Update this line to use streamUserId
    await serverClient.upsertUser({ 
      id: streamUserId, 
      name, 
      image, 
      role: 'admin' 
    } as any);

    const token = serverClient.createToken(streamUserId);

    return NextResponse.json({
      token,
      userId: streamUserId,
      name,
      image,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    });
  } catch (err) {
    console.error('[chat/token] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}