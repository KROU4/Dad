import { useState, useEffect } from 'react'
import { supabase, STORAGE_BUCKET } from '../lib/supabase'

export interface Work {
  id: number
  title: string
  description: string
  location: string
  category: string
  cover: string
  images: string[]
  published: number
  created_at: string
}

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.match(/\.[^.]+$/)?.[0] || '.jpg'
  const path = `works/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return publicUrl
}

export function useAdminWorks() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) {
        setError(err.message)
        setWorks([])
      } else {
        setWorks((data || []).map(r => ({
          ...r,
          images: Array.isArray(r.images) ? r.images : [],
        })))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
  }, [])

  const createWork = async (data: {
    title: string
    description: string
    location: string
    category: string
    published: boolean
    existingImages: string[]
    newFiles: File[]
  }) => {
    const urls = [...data.existingImages]
    for (const f of data.newFiles) {
      urls.push(await uploadFile(f))
    }
    const cover = urls[0] || ''
    const { error: err } = await supabase.from('works').insert({
      title: data.title,
      description: data.description,
      location: data.location,
      category: data.category,
      cover,
      images: urls,
      published: data.published ? 1 : 0,
    })
    if (err) throw new Error(err.message)
    fetchWorks()
  }

  const updateWork = async (
    id: number,
    data: {
      title: string
      description: string
      location: string
      category: string
      published: boolean
      existingImages: string[]
      newFiles: File[]
    }
  ) => {
    const urls = [...data.existingImages]
    for (const f of data.newFiles) {
      urls.push(await uploadFile(f))
    }
    const cover = urls[0] || ''
    const { error: err } = await supabase
      .from('works')
      .update({
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        cover,
        images: urls,
        published: data.published ? 1 : 0,
      })
      .eq('id', id)
    if (err) throw new Error(err.message)
    fetchWorks()
  }

  const togglePublish = async (w: Work) => {
    const { error: err } = await supabase
      .from('works')
      .update({ published: w.published ? 0 : 1 })
      .eq('id', w.id)
    if (err) throw new Error(err.message)
    fetchWorks()
  }

  const deleteWork = async (id: number) => {
    const { error: err } = await supabase.from('works').delete().eq('id', id)
    if (err) throw new Error(err.message)
    fetchWorks()
  }

  return { works, loading, error, fetchWorks, createWork, updateWork, togglePublish, deleteWork }
}
