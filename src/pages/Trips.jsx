import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import './Trips.css'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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

  const handleDelete = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this expedition? This action cannot be undone.")) return;

    try {
      // 1. Delete associated photos to avoid foreign key constraints
      const { error: photosError } = await supabase
        .from('photos')
        .delete()
        .eq('trip_id', tripId);
        
      if (photosError) throw photosError;

      // 2. Delete the trip and return the deleted row to verify success
      const { data, error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId)
        .select();
      
      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Deletion blocked. Please check your database permissions.");
      }

      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert(`Failed to delete the trip: ${err.message || err.details || "Unknown error"}`);
    }
  }

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
                style={{ animationDelay: `${i * 0.05}s`, position: 'relative' }}
              >
                <div 
                  style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <button
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      setOpenMenuId(openMenuId === t.id ? null : t.id); 
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      backdropFilter: 'blur(4px)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--clr-ink)',
                      fontSize: '1.2rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s var(--ease), background 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'; }}
                    title="Options"
                  >
                    ⋮
                  </button>

                  {openMenuId === t.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      minWidth: '120px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid var(--clr-surface-mid)'
                    }}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          setOpenMenuId(null);
                          const newName = window.prompt("Enter new expedition title:", t.title);
                          if (newName && newName.trim()) {
                            supabase.from('trips').update({ title: newName }).eq('id', t.id).then(({error}) => {
                              if (!error) {
                                setTrips(prev => prev.map(trip => trip.id === t.id ? {...trip, title: newName} : trip));
                              } else {
                                alert("Failed to update title.");
                              }
                            });
                          }
                        }}
                        style={{ padding: '10px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--clr-ink)', transition: 'background 0.2s', borderBottom: '1px solid var(--clr-surface-mid)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-surface-low)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Edit Trip
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          setOpenMenuId(null);
                          handleDelete(e, t.id);
                        }}
                        style={{ padding: '10px 16px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--clr-error)', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-surface-low)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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
