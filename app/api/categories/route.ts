import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { verifyToken } from '@/lib/auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const categories = storage.getCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, color } = await request.json()

    const category = {
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      color: color || '#0ea5e9',
    }

    storage.addCategory(category)

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
