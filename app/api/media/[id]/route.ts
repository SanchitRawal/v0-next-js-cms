import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Media from '@/lib/models/Media'
import { verifyToken } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const media = await Media.findByIdAndDelete(params.id)

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Media deleted' })
  } catch (error) {
    console.error('Media deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
