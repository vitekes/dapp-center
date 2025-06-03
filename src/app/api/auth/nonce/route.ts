import { NextResponse } from 'next/server';
import { generateNonce } from 'siwe';

export function GET() {
  const nonce = generateNonce();

  // формируем ответ и кладём в него cookie
  const res = NextResponse.json({ nonce });
  res.cookies.set('siwe-nonce', nonce, {
    httpOnly: true,
    path: '/',
  });

  return res;
}