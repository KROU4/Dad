import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

export function useWorks() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data, error: err } = await supabase
        .from('works')
        .select('id, title, description, location, category, cover, images, created_at')
        .eq('published', 1)
        .order('created_at', { ascending: false })
      if (!mounted) return
      if (err) {
        setError(err.message)
        setWorks([])
      } else {
        setWorks((data || []).map(r => ({
          ...r,
          images: Array.isArray(r.images) ? r.images : [],
          published: 1,
        })))
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return { works, loading, error }
}
