// FRONTEND: app/api/chat/token/route.ts

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse }      from 'next/server';
import { StreamChat }        from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user  = await currentUser();
    const name  = user?.fullName ?? user?.firstName ?? 'User';
    const image = user?.imageUrl ?? '';

    // Upsert as admin — bypasses all Stream permission checks
    await serverClient.upsertUser({ id: userId, name, image, role: 'admin' } as any);

    const token = serverClient.createToken(userId);

    return NextResponse.json({
      token,
      userId,
      name,
      image,
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    });
  } catch (err) {
    console.error('[chat/token]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}