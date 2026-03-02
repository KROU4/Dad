import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useContact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: { name: string; phone: string; idea: string }) => {
    setStatus('loading')
    setError(null)
    const { error: err } = await supabase.from('contacts').insert({
      name: data.name,
      phone: data.phone,
      idea: data.idea,
    })
    if (err) {
      setStatus('error')
      setError(err.message)
      return false
    }
    setStatus('success')
    return true
  }

  return { submit, status, error }
}
