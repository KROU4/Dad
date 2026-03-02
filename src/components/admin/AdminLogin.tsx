import { useState } from 'react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useRegistrationOpen } from '../../hooks/useRegistrationOpen'

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { error, signIn, signUp } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const registrationOpen = useRegistrationOpen()

  const showSignUp = registrationOpen === true
  const canSignUp = showSignUp && isSignUp

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const ok = canSignUp ? await signUp(email, password) : await signIn(email, password)
      if (ok) onLogin()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form onSubmit={handleSubmitForm} className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h1 className="font-playfair font-bold text-2xl text-dark mb-2">Админ-панель</h1>
        <p className="font-mulish text-sm text-muted mb-6">
          {canSignUp ? 'Создайте учётную запись (однократно)' : 'Войдите по email и паролю'}
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark outline-none focus:ring-2 focus:ring-primary/30 mb-3"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-bg rounded-xl px-4 py-3 font-mulish text-dark outline-none focus:ring-2 focus:ring-primary/30 mb-4"
          autoFocus={!!email}
        />
        {error && <p className="text-red-600 font-mulish text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-interactive w-full bg-primary text-white font-mulish font-bold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-70 mb-3"
        >
          {loading ? '...' : canSignUp ? 'Зарегистрироваться' : 'Войти'}
        </button>
        {showSignUp && (
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full font-mulish text-sm text-muted hover:text-dark"
          >
            {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        )}
      </form>
    </div>
  )
}
