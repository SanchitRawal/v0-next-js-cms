'use client'

import React from "react"

import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  color?: string
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setCategories([...categories, data.data])
        setFormData({ name: '', description: '', color: '#3b82f6' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage CMS configuration</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Categories</h2>
                <p className="text-muted-foreground mt-1">Organize your content with categories</p>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus size={20} className="mr-2" />
                Add Category
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleAddCategory} className="space-y-4 mb-6 p-4 bg-card/50 rounded-lg">
                <Input
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 rounded"
                  />
                  <span className="text-sm text-muted-foreground">{formData.color}</span>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Category</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {loading ? (
              <p className="text-muted-foreground">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground">No categories yet. Create one to get started.</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Aeroplay Media CMS v1.0</p>
              <p>A professional content management system for managing videos, audio, and blog content.</p>
              <div className="pt-4 border-t border-border">
                <p className="font-medium text-foreground mb-2">Features:</p>
                <ul className="space-y-1">
                  <li>✓ Multi-content type support (Video, Audio, Blog Posts)</li>
                  <li>✓ Role-based access control (Admin, Editor, Viewer)</li>
                  <li>✓ Media library with file management</li>
                  <li>✓ Content categorization and tagging</li>
                  <li>✓ Draft and published workflows</li>
                  <li>✓ Search and filtering capabilities</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
