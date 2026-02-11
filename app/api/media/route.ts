import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Media from '@/lib/models/Media'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const query: any = {}
    if (type) query.type = type

    const skip = (page - 1) * limit

    const [media, total] = await Promise.all([
      Media.find(query)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Media.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    const user = verifyToken(token || '')

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Simulate file upload - in production, use a service like Cloudinary, AWS S3, or Vercel Blob
    const filename = `${Date.now()}-${file.name}`
    const url = `/uploads/${filename}`
    const size = file.size

    const mediaType = file.type.startsWith('video')
      ? 'video'
      : file.type.startsWith('audio')
        ? 'audio'
        : 'image'

    const media = await Media.create({
      title: title || file.name,
      filename,
      url,
      type: mediaType,
      size,
      uploadedBy: user.userId,
    })

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
