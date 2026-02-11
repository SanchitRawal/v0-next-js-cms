import mongoose, { Schema, Document } from 'mongoose'

export interface IContent extends Document {
  title: string
  slug: string
  description: string
  content: string
  type: 'video' | 'audio' | 'post'
  category: string
  tags: string[]
  thumbnail?: string
  mediaUrl?: string
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published'
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    type: {
      type: String,
      enum: ['video', 'audio', 'post'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    thumbnail: String,
    mediaUrl: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Create slug from title before saving
contentSchema.pre<IContent>('save', async function (next) {
  if (!this.isModified('title')) {
    return next()
  }

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  next()
})

export default mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema)
