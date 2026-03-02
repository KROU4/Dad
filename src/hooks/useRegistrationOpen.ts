import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useRegistrationOpen() {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    supabase
      .from('site_config')
      .select('value')
      .eq('key', 'registration_open')
      .single()
      .then(({ data, error }) => {
        if (error) {
          setOpen(false)
          return
        }
        const v = data?.value
        setOpen(v === true || v === 'true')
      })
  }, [])

  return open
}
