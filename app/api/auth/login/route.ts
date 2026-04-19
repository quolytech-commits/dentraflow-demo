import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dhe fjalëkalimi janë të detyrueshëm.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    if (!user) {
      return NextResponse.json({ error: 'Email-i nuk u gjet në sistem.' }, { status: 401 })
    }

    const valid = await compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Fjalëkalimi është i gabuar.' }, { status: 401 })
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar ?? user.name.slice(0, 2).toUpperCase(),
      specialty: user.specialty ?? undefined,
    })

    const cookie = setSessionCookie(token)
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar ?? user.name.slice(0, 2).toUpperCase(),
        specialty: user.specialty,
      },
    })

    res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2])
    return res
  } catch (err) {
    console.error('[AUTH LOGIN]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm i serverit.' }, { status: 500 })
  }
}
