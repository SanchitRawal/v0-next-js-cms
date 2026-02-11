import mongoose, { Schema, Document } from 'mongoose'

export interface IMedia extends Document {
  title: string
  filename: string
  url: string
  type: 'image' | 'video' | 'audio'
  size: number
  uploadedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Media || mongoose.model<IMedia>('Media', mediaSchema)
