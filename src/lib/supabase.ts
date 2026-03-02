import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Supabase: VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY должны быть в .env')
}

export const supabase = createClient(url || '', anonKey || '', {
  auth: { persistSession: true, storage: localStorage },
})

export const STORAGE_BUCKET = 'works-images'
