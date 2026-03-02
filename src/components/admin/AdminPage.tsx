import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e: string, s) => {
      setSession(!!s)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(false)
  }

  if (session === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-mulish text-muted">Загрузка...</p>
      </div>
    )
  }

  if (!session) {
    return <AdminLogin onLogin={() => setSession(true)} />
  }

  return <AdminPanel onLogout={handleLogout} />
}
