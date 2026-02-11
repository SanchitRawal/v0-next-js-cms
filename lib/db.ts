import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI

let cached = global.mongoose as any

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (!mongoUri) {
    console.warn('MONGODB_URI not set. Database operations will be limited.')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongooseInstance) => {
        return mongooseInstance
      })
      .catch((e) => {
        console.error('MongoDB connection failed:', e.message)
        return null
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    return null
  }

  return cached.conn
}

declare global {
  var mongoose: {
    conn: any
    promise: Promise<any>
  }
}
