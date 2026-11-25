
import { useState, type FormEvent } from 'react'
import { login } from '../services/api'

type LoginProps = {
  onLogin: (
    token: string,
    user: { id: number; name: string; email: string; role: string }
  ) => void
  onSwitchToRegister: () => void
}

function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)

      if (!data.access_token || !data.user) {
        throw new Error('Invalid login response from server.')
      }

      onLogin(data.access_token, data.user)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister}>
          Register
        </button>
      </p>
    </form>
  )
}

export default Login
