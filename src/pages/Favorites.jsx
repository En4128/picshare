import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import ImageModal from '../components/ImageModal.jsx'

export default function Favorites() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [favoritePhotos, setFavoritePhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    async function fetchData() {
      // Fetch trip info
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()

      if (tripData) setTrip(tripData)

      // Get favorite IDs from localStorage
      let favIds = []
      try {
        favIds = JSON.parse(localStorage.getItem(`fav_${id}`) || '[]')
      } catch { favIds = [] }

      if (favIds.length > 0) {
        const { data: photosData } = await supabase
          .from('photos')
          .select('*')
          .in('id', favIds)
          .eq('trip_id', id)

        if (photosData) setFavoritePhotos(photosData)
      }

      setLoading(false)
    }

    if (id) fetchData()
  }, [id])

  const removeFavorite = (photoId) => {
    setFavoritePhotos(prev => prev.filter(p => p.id !== photoId))
    try {
      const current = JSON.parse(localStorage.getItem(`fav_${id}`) || '[]')
      localStorage.setItem(`fav_${id}`, JSON.stringify(current.filter(fid => fid !== photoId)))
    } catch { /* ignore */ }
  }

  const toggleFavorite = (photoId) => {
    removeFavorite(photoId)
    setSelectedPhoto(null)
  }

  return (
    <main className="favorites-page page-pad">
      <div className="container">

        {/* Header */}
        <div className="dashboard__header fade-up">
          <div className="dashboard__header-left">
            <span className="label-caps">
              {trip ? (trip.subtitle || 'Expedition') : 'Loading...'}
            </span>
            <h1 className="display-md" style={{ marginTop: '0.4rem' }}>
              {trip ? trip.title : ''}
            </h1>
          </div>
        </div>

        {/* Subnav */}
        <nav className="dashboard__subnav fade-up fade-up-d1">
          <Link to={`/trips/${id}`}           className="dashboard__subnav-link">Gallery</Link>
          <Link to={`/trips/${id}/favorites`} className="dashboard__subnav-link active">Favorites</Link>
          <Link to={`/trips/${id}/upload`}    className="dashboard__subnav-link">Upload</Link>
        </nav>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--clr-ink-muted)' }}>
            Loading favorites...
          </div>
        ) : favoritePhotos.length === 0 ? (
          <div className="fade-up fade-up-d2" style={{
            textAlign: 'center',
            padding: '6rem 0',
            background: 'var(--clr-surface-low)',
            borderRadius: 'var(--r-md)',
            marginTop: 'var(--sp-6)'
          }}>
            <span style={{ fontSize: '3rem' }}>♡</span>
            <h3 className="headline" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>No favorites yet</h3>
            <p style={{ color: 'var(--clr-ink-muted)', marginBottom: '1.5rem' }}>
              Heart any photo in the gallery to save it here.
            </p>
            <Link to={`/trips/${id}`} className="btn btn-primary">Go to Gallery</Link>
          </div>
        ) : (
          <div
            className="fade-up fade-up-d2"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--sp-5)',
              marginTop: 'var(--sp-6)'
            }}
          >
            {favoritePhotos.map((p) => (
              <div 
                key={p.id} 
                className="card" 
                style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setSelectedPhoto(p)}
              >
                {/* Unfavorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(p.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 10,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    color: '#e05252',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s var(--ease)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Remove from favorites"
                >
                  ♥
                </button>
                <div className="img-ratio ratio-1-1" style={{ background: 'var(--clr-surface-mid)' }}>
                  {p.url ? (
                    <img
                      src={p.url}
                      alt="Favorite photo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="photo-placeholder" style={{ background: p.color_hex || '#e8e8e8' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          isFavorite={true}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </main>
  )
}
