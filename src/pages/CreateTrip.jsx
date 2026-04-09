import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [dates, setDates] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!tripName) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: insertError } = await supabase
        .from('trips')
        .insert([{ title: tripName, date_range: dates }])
        .select()
        
      if (insertError) throw insertError
      
      if (data && data.length > 0) {
        navigate(`/trips/${data[0].id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="create-page page-pad" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="fade-up text-center" style={{ textAlign: 'center' }}>
          <span className="label-caps">The Alchemist</span>
          <h1 className="display-md" style={{ margin: 'var(--sp-2) 0 var(--sp-4)' }}>Start Your Voyage</h1>
          <p style={{ color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-6)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Design a unique archive for your next exploration. Define the soul of your trip.
          </p>
        </div>

        <form onSubmit={handleCreate} className="card fade-up fade-up-d1" style={{ padding: 'var(--sp-6)' }}>
          {error && <div className="login-error" style={{ marginBottom: '1.5rem', background: 'var(--clr-error)', color: '#fff', padding: '1rem', borderRadius: '4px' }}>{error}</div>}

          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="input-label" htmlFor="tripName">Expedition Title</label>
            <input 
              id="tripName"
              type="text" 
              className="input" 
              placeholder="e.g. Kyoto in Autumn" 
              value={tripName} 
              onChange={e => setTripName(e.target.value)} 
              required
            />
          </div>

          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <label className="input-label" htmlFor="dates">Date Range</label>
            <input 
              id="dates"
              type="text" 
              className="input" 
              placeholder="e.g. Oct 20 – Oct 30, 2024" 
              value={dates} 
              onChange={e => setDates(e.target.value)} 
            />
          </div>

          <div style={{ padding: 'var(--sp-5)', border: '1px dashed var(--clr-surface-mid)', borderRadius: 'var(--r-md)', textAlign: 'center', marginBottom: 'var(--sp-6)', background: 'var(--clr-surface-low)' }}>
             <span style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)', display: 'block' }}>🖼️</span>
             <h4 className="label-caps">Drop a Cover Image</h4>
             <p style={{ fontSize: '0.8rem', color: 'var(--clr-ink-muted)', marginTop: '0.2rem' }}>High-res JPEG or PNG preferred</p>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Launching...' : 'Launch Archive'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', color: 'var(--clr-ink-muted)' }}>
            By launching, you agree to our <span style={{ textDecoration: 'underline' }}>Curated Guidelines</span>.
          </p>
        </form>

        <div className="fade-up fade-up-d2 text-center" style={{ textAlign: 'center', marginTop: 'var(--sp-5)' }}>
          <Link to="/" className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Cancel</Link>
        </div>

      </div>
    </main>
  )
}
