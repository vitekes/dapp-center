import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ok: true});

    // удаляем cookie (тот же path, что при установке)
    res.cookies.delete({
        name: 'siwe-session',
        path: '/',
    });

    return res;
}