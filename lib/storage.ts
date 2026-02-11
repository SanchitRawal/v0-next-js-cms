// In-memory storage for demo purposes
interface DemoUser {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
}

interface DemoContent {
  id: string
  title: string
  description: string
  content: string
  type: 'video' | 'audio' | 'post'
  status: 'draft' | 'published'
  categoryId: string
  authorId: string
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

interface DemoMedia {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  createdAt: Date
}

interface DemoCategory {
  id: string
  name: string
  slug: string
  color: string
  description: string
}

let users: DemoUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@aeroplay.com',
    password: 'password123',
    role: 'admin',
  },
]

let contents: DemoContent[] = []
let media: DemoMedia[] = []
let categories: DemoCategory[] = [
  {
    id: '1',
    name: 'Tutorials',
    slug: 'tutorials',
    color: '#0ea5e9',
    description: 'Educational content',
  },
  {
    id: '2',
    name: 'News',
    slug: 'news',
    color: '#f97316',
    description: 'Latest updates',
  },
]

export const storage = {
  users,
  contents,
  media,
  categories,

  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  getUserById: (id: string) => users.find((u) => u.id === id),
  addUser: (user: DemoUser) => {
    users.push(user)
    return user
  },

  getContentById: (id: string) => contents.find((c) => c.id === id),
  getAllContent: () => contents,
  getContentByType: (type: string) => contents.filter((c) => c.type === type),
  addContent: (content: DemoContent) => {
    contents.push(content)
    return content
  },
  updateContent: (id: string, updates: Partial<DemoContent>) => {
    const index = contents.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents[index] = { ...contents[index], ...updates }
      return contents[index]
    }
    return null
  },
  deleteContent: (id: string) => {
    contents = contents.filter((c) => c.id !== id)
  },

  getMediaById: (id: string) => media.find((m) => m.id === id),
  getAllMedia: () => media,
  getMediaByType: (type: string) => media.filter((m) => m.type === type),
  addMedia: (item: DemoMedia) => {
    media.push(item)
    return item
  },
  deleteMedia: (id: string) => {
    media = media.filter((m) => m.id !== id)
  },

  getCategories: () => categories,
  getCategoryById: (id: string) => categories.find((c) => c.id === id),
  addCategory: (category: DemoCategory) => {
    categories.push(category)
    return category
  },
  updateCategory: (id: string, updates: Partial<DemoCategory>) => {
    const index = categories.findIndex((c) => c.id === id)
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates }
      return categories[index]
    }
    return null
  },
}
