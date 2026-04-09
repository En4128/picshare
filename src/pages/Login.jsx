import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/AuthContext.jsx'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)

  // Redirect if immediately logged in
  useEffect(() => {
    if (user) {
      navigate('/trips')
    }
  }, [user, navigate])

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for the confirmation link! (Or sign in directly if email confirmations are off in your Supabase project)')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/trips')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page page-pad">
      <div className="container" style={{ maxWidth: '500px', margin: '0 auto', paddingTop: 'var(--sp-6)' }}>
        
        <div className="fade-up text-center" style={{ textAlign: 'center' }}>
          <span className="label-caps">The Alchemist</span>
          <h1 className="display-md" style={{ margin: 'var(--sp-2) 0 var(--sp-4)' }}>
            {isSignUp ? 'Begin Your Journey' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-6)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {isSignUp ? 'Create a private archive for your memories.' : 'Access your curated visual expeditions.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="card fade-up fade-up-d1" style={{ padding: 'var(--sp-6)' }}>
          {error && <div className="login-error">{error}</div>}

          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="input-label" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="input" 
              placeholder="explorer@alchemist.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>

          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="input" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Create Archive' : 'Enter Archive'}
          </button>
        </form>

        <div className="fade-up fade-up-d2 text-center" style={{ textAlign: 'center', margin: 'var(--sp-5) auto' }}>
          <button 
            type="button" 
            className="btn btn-ghost" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', border: 'none' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an archive? Sign In' : 'Need an archive? Create one'}
          </button>
        </div>

      </div>
    </main>
  )
}
