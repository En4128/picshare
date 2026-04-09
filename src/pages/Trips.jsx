import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import './Trips.css'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrips() {
      // Fetch all trips from Supabase ordered by newest first
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setTrips(data)
      } else if (error) {
        console.error("Error fetching trips:", error)
      }
      setLoading(false)
    }
    fetchTrips()
  }, [])

  return (
    <main className="trips-page page-pad">
      <div className="container">
        <div className="trips-page__header fade-up">
          <div>
            <span className="label-caps">Your Collection</span>
            <h1 className="display-md" style={{ marginTop: '0.5rem' }}>Trips</h1>
          </div>
          <Link to="/create" className="btn btn-primary">+ New Trip</Link>
        </div>

        {loading ? (
          <div className="fade-up fade-up-d1" style={{ padding: 'var(--sp-6) 0', color: 'var(--clr-ink-muted)' }}>
            Retrieving your archive...
          </div>
        ) : trips.length === 0 ? (
          <div className="fade-up fade-up-d1 card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--clr-surface-low)' }}>
             <span style={{ fontSize: '2.5rem' }}>🌍</span>
             <h2 className="headline" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>The archive is empty</h2>
             <p style={{ color: 'var(--clr-ink-muted)', marginBottom: '2rem' }}>Launch your very first expedition to begin curating your journey.</p>
             <Link to="/create" className="btn btn-primary" style={{ display: 'inline-flex' }}>Launch Archive</Link>
          </div>
        ) : (
          <div className="trips-page__grid">
            {trips.map((t, i) => (
              <Link
                to={`/trips/${t.id}`}
                key={t.id}
                className={`trip-card card fade-up`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="img-ratio ratio-3-2">
                  <div
                    className="photo-placeholder"
                    style={{ background: `linear-gradient(135deg, ${t.color_a || '#d4e8d0'}, ${t.color_b || '#a8c5a0'})` }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>📷</span>
                  </div>
                </div>
                <div className="trip-card__body">
                  <div className="trip-card__top">
                    <span className={`tag ${t.status === 'Live' ? 'tag-accent' : ''}`}>{t.status || 'Archived'}</span>
                    <span className="label-caps">{t.date_range}</span>
                  </div>
                  <h2 className="headline trip-card__title">{t.title}</h2>
                  <div className="trip-card__meta">
                    <span>Curated Collection</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
