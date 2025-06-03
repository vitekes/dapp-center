import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SiweMessage } from 'siwe';

export async function POST(req: Request) {
  const { message, signature } = await req.json();
  const nonce = cookies().get('siwe-nonce')?.value;
  if (!nonce) return NextResponse.json({ error: 'No nonce' }, { status: 400 });

  try {
    const siweMessage = new SiweMessage(message);
    await siweMessage.verify({ signature, nonce });
    cookies().set('siwe-session', siweMessage.address, { httpOnly: true, path: '/' });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}

export function GET() {
  const address = cookies().get('siwe-session')?.value ?? null;
  return NextResponse.json({ address });
}
