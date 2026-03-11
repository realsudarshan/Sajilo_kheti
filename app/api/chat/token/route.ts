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
    if (!userId) {
      console.warn('[chat/token] No userId from Clerk auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const name = user?.fullName ?? user?.firstName ?? 'User';
    const image = user?.imageUrl ?? '';

    // MANDATORY FIX: Add prefix to bypass "Deleted User" error (Code 16)
    const streamUserId = `sk_${userId}`; 
    const apiKey       = process.env.NEXT_PUBLIC_STREAM_API_KEY;

    if (!apiKey || !process.env.STREAM_API_SECRET) {
      console.error('[chat/token] Missing Stream credentials. apiKey set:', !!apiKey, 'secret set:', !!process.env.STREAM_API_SECRET);
      return NextResponse.json({ error: 'Chat not configured on server' }, { status: 500 });
    }

    // Update this line to use streamUserId
    await serverClient.upsertUser({ 
      id: streamUserId, 
      name, 
      image, 
      role: 'admin' 
    } as any);

    const token = serverClient.createToken(streamUserId);

    console.log('[chat/token] Issued token for', streamUserId, '| apiKey present:', !!apiKey);

    return NextResponse.json({
      token,
      userId: streamUserId,
      name,
      image,
      apiKey,
    });
  } catch (err) {
    console.error('[chat/token] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}