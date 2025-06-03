import { NextResponse } from 'next/server';
import { generateNonce } from 'siwe';
import { cookies } from 'next/headers';

export function GET() {
  const nonce = generateNonce();
  cookies().set('siwe-nonce', nonce, { httpOnly: true });
  return NextResponse.json({ nonce });
}
