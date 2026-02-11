import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { verifyToken } from '@/lib/auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let results = storage.getAllContent()

    if (type) results = results.filter((c) => c.type === type)
    if (status) results = results.filter((c) => c.status === status)
    if (category) results = results.filter((c) => c.categoryId === category)

    if (search) {
      const lowerSearch = search.toLowerCase()
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerSearch) || c.description.toLowerCase().includes(lowerSearch)
      )
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const skip = (page - 1) * limit
    const paginatedResults = results.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      pagination: {
        total: results.length,
        page,
        limit,
        pages: Math.ceil(results.length / limit),
      },
    })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const newContent = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      content: body.content,
      type: body.type || 'post',
      status: body.status || 'draft',
      categoryId: body.categoryId || '1',
      authorId: user.userId,
      featured: body.featured || false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    storage.addContent(newContent)

    return NextResponse.json({ success: true, data: newContent }, { status: 201 })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
