import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: Date
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  { timestamps: true }
)

categorySchema.pre<ICategory>('save', async function (next) {
  if (!this.isModified('name')) {
    return next()
  }

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  next()
})

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)
