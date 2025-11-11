import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('auth-session')?.value;
  const user = getUserFromSession(session || null);

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, user });
}
