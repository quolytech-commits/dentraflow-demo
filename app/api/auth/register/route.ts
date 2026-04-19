import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'recepsion', specialty } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Emri, email-i dhe fjalëkalimi janë të detyrueshëm.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Ky email është tashmë i regjistruar.' }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)
    const avatar = name.slice(0, 2).toUpperCase()

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        avatar,
        specialty: specialty ?? null,
      },
    })

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar ?? avatar,
      specialty: user.specialty ?? undefined,
    })

    const cookie = setSessionCookie(token)
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        specialty: user.specialty,
      },
    }, { status: 201 })

    res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2])
    return res
  } catch (err) {
    console.error('[AUTH REGISTER]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm i serverit.' }, { status: 500 })
  }
}
