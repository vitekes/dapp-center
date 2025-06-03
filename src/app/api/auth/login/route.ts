import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SiweMessage } from 'siwe';

/* ---------------------------  POST /api/auth  --------------------------- */
export async function POST(req: Request) {
  const { message, signature } = await req.json();

  /* читаем куки ― нужен await */
  const cookieStore = await cookies();
  const nonce = cookieStore.get('siwe-nonce')?.value;
  if (!nonce) return NextResponse.json({ error: 'No nonce' }, { status: 400 });

  try {
    const siweMessage = new SiweMessage(message);
    await siweMessage.verify({ signature, nonce });

    /* формируем ответ и туда пишем сет-куку */
    const res = NextResponse.json({ ok: true });
    res.cookies.set('siwe-session', siweMessage.address, {
      httpOnly: true,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}

/* ----------------------------  GET /api/auth  --------------------------- */
export async function GET() {
  const cookieStore = await cookies();
  const address = cookieStore.get('siwe-session')?.value ?? null;
  return NextResponse.json({ address });
}