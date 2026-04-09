import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function JoinTrip() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const handleJoin = (e) => {
    e.preventDefault()
    if (code) {
      navigate(`/trips/${code}`)
    }
  }

  return (
    <main className="join-page page-pad" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '560px', margin: '0 auto' }}>
        
        <div className="fade-up text-center" style={{ textAlign: 'center' }}>
          <span className="label-caps">The Alchemist</span>
          <h1 className="display-md" style={{ margin: 'var(--sp-2) 0 var(--sp-4)' }}>Join an Expedition</h1>
          <p style={{ color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-6)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Paste your unique invitation code to begin. No account required to view trip details.
          </p>
        </div>

        <form onSubmit={handleJoin} className="card fade-up fade-up-d1" style={{ padding: 'var(--sp-6)' }}>
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="input-label" htmlFor="code">Invitation Code</label>
            <input 
              id="code"
              type="text" 
              className="input" 
              placeholder="e.g. alps24" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Enter Archive
          </button>
        </form>

        <div className="fade-up fade-up-d2 text-center" style={{ textAlign: 'center', marginTop: 'var(--sp-5)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-ink-muted)' }}>
            Want to start your own? <Link to="/create" style={{ color: 'var(--clr-ink)', fontWeight: 500, textDecoration: 'underline' }}>Create a trip</Link>
          </span>
        </div>

      </div>
    </main>
  )
}
