import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { generateToken } from '@/lib/auth'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json()

    if (action === 'login') {
      const user = storage.getUserByEmail(email)

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      if (user.password !== hashPassword(password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    if (action === 'signup') {
      const existingUser = storage.getUserByEmail(email)

      if (existingUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: name || email,
        email,
        password: hashPassword(password),
        role: 'editor' as const,
      }

      storage.addUser(newUser)

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      })

      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      })

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
