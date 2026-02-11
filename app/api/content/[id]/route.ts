import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Content from '@/lib/models/Content'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const content = await Content.findById(params.id).populate('author', 'name email')

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error('Content fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const content = await Content.findById(params.id)

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    if (content.author.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updated = await Content.findByIdAndUpdate(params.id, body, { new: true })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const content = await Content.findByIdAndDelete(params.id)

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Content deleted' })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
