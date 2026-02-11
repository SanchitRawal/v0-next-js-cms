import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aeroplay-cms'

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Create collections
    const db = mongoose.connection

    // Create User
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: 'admin' },
      active: { type: Boolean, default: true },
    }, { timestamps: true }))

    const Category = mongoose.model('Category', new mongoose.Schema({
      name: { type: String, unique: true },
      slug: { type: String, unique: true },
      color: String,
    }, { timestamps: true }))

    // Clear existing data
    await User.deleteMany({})
    await Category.deleteMany({})

    // Create admin user
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash('password123', salt)

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@aeroplay.com',
      password: hashedPassword,
      role: 'admin',
    })

    console.log('✓ Created admin user: admin@aeroplay.com / password123')

    // Create default categories
    const categories = await Category.insertMany([
      { name: 'News', slug: 'news', color: '#3b82f6' },
      { name: 'Tutorials', slug: 'tutorials', color: '#8b5cf6' },
      { name: 'Music', slug: 'music', color: '#ec4899' },
      { name: 'Podcasts', slug: 'podcasts', color: '#f59e0b' },
    ])

    console.log('✓ Created 4 default categories')

    console.log('\nSeed data created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDatabase()
