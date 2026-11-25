
import { useState, type FormEvent } from 'react'

type LoginProps = {
  onLogin: (token: string, user: { id: number; name: string; email: string; role: string }) => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('https://makuori-store.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Login failed')
        return
      }

      onLogin(data.access_token, data.user)
    } catch {
      setError('Could not connect to the server.')
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

      <button type="submit">Login</button>
    </form>
  )
}

export default Login

