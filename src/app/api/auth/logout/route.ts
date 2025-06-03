import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export function POST() {
  cookies().delete('siwe-session');
  return NextResponse.json({ ok: true });
}
