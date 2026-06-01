import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import ImageModal from '../components/ImageModal.jsx'
import DialogModal from '../components/DialogModal.jsx'
import './TripDashboard.css'

export default function TripDashboard() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fav_${id}`) || '[]') } catch { return [] }
  })
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoToDelete, setPhotoToDelete] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch the overarching trip details
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()
        
      if (tripData) setTrip(tripData)

      // Fetch all photos tied to this trip
      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('trip_id', id)
        .order('created_at', { ascending: true })

      if (photosData) setPhotos(photosData)
      setLoading(false)
    }

    if (id) fetchDashboardData()
  }, [id])

  const toggleFavorite = useCallback((photoId) => {
    setFavorites(prev => {
      const next = prev.includes(photoId)
        ? prev.filter(fid => fid !== photoId)
        : [...prev, photoId]
      localStorage.setItem(`fav_${id}`, JSON.stringify(next))
      return next
    })
  }, [id])

  const handleDelete = (photo) => {
    setPhotoToDelete(photo)
  }

  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return
    const photo = photoToDelete
    try {
      if (photo.url) {
        const filePath = photo.url.split('/picshare/')[1];
        if (filePath) {
          await supabase.storage.from('picshare').remove([filePath])
        }
      }
      
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)

      if (error) throw error

      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null)
      }
    } catch (err) {
      console.error("Failed to delete photo:", err.message)
      alert("Failed to delete image. Please check your Supabase Database RLS DELETE policies.")
    } finally {
      setPhotoToDelete(null)
    }
  }

  if (loading) {
    return (
      <main className="dashboard page-pad">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--clr-ink-muted)' }}>
          Retrieving curated archive...
        </div>
      </main>
    )
  }

  if (!trip) {
    return (
      <main className="dashboard page-pad">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--clr-ink-muted)' }}>
          Expedition archive not found.
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard page-pad">
      <div className="container">
        
        {/* Header */}
        <div className="dashboard__header fade-up">
          <div className="dashboard__header-left">
            <span className="label-caps">Current Expedition</span>
            <h1 className="display-md" style={{ marginTop: '0.4rem' }}>{trip.title}</h1>
            <div className="dashboard__header-meta">
              <span className="tag tag-accent">● {trip.status || 'Live'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--clr-ink-muted)' }}>
                {trip.date_range} · {photos.length} photos
              </span>
            </div>
          </div>
          <div className="dashboard__header-actions">
            <Link to={`/trips/${id}/upload`}  className="btn btn-ghost">Upload Asset</Link>
            <Link to={`/trips/${id}/share`}   className="btn btn-ghost">Share</Link>
            <Link to={`/trips/${id}/favorites`} className="btn btn-primary">Favorites ›</Link>
          </div>
        </div>

        {/* Sub-nav */}
        <nav className="dashboard__subnav fade-up fade-up-d1">
          <Link to={`/trips/${id}`}           className="dashboard__subnav-link active">Gallery</Link>
          <Link to={`/trips/${id}/favorites`} className="dashboard__subnav-link">Favorites</Link>
          <Link to={`/trips/${id}/upload`}    className="dashboard__subnav-link">Upload</Link>
        </nav>

        {/* Stats Row */}
        <div className="dashboard__stats fade-up fade-up-d2">
          {[
            { label: 'Total Images', value: photos.length.toString() },
            { label: 'Members', value: '1' },
            { label: 'Archive Status', value: trip.status || 'Live' },
          ].map(s => (
            <div key={s.label} className="dashboard__stat card">
              <span className="display-md dashboard__stat-val" style={{ fontSize: '2.5rem' }}>{s.value}</span>
              <span className="label-caps">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Photo Grid */}
        <div className="dashboard__grid fade-up fade-up-d3">
          {photos.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '6rem 0', textAlign: 'center', background: 'var(--clr-surface-low)', borderRadius: 'var(--r-md)' }}>
              <span style={{ fontSize: '2.5rem' }}>📸</span>
              <h3 className="headline" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Gallery is empty</h3>
              <p style={{ color: 'var(--clr-ink-muted)', marginBottom: '1.5rem' }}>No assets have been uploaded to this expedition yet.</p>
              <Link to={`/trips/${id}/upload`} className="btn btn-primary">Start Uploading</Link>
            </div>
          ) : (
            photos.map((p, idx) => {
              const isFav = favorites.includes(p.id)
              return (
                <div 
                  key={p.id} 
                  className="dashboard__photo card" 
                  style={{ animationDelay: `${idx * 0.05}s`, position: 'relative', cursor: 'pointer' }}
                  onClick={() => setSelectedPhoto(p)}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(p)
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 10,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: 'none',
                      backdropFilter: 'blur(4px)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--clr-error)',
                      fontSize: '1.2rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s var(--ease)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Remove Asset"
                  >
                    ✕
                  </button>
                  {/* Favorite heart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(p.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      zIndex: 10,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: 'none',
                      backdropFilter: 'blur(4px)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s var(--ease)',
                      color: isFav ? '#e05252' : '#aaa'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFav ? '♥' : '♡'}
                  </button>
                  <div className="img-ratio ratio-1-1" style={{ background: 'var(--clr-surface-mid)' }}>
                    {p.url ? (
                      <img
                        src={p.url}
                        alt="Archived exhibition photo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="photo-placeholder" style={{ background: p.color_hex || '#e8e8e8' }} />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>

      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          isFavorite={favorites.includes(selectedPhoto.id)}
          onToggleFavorite={(photoId) => {
            toggleFavorite(photoId);
          }}
          onDelete={handleDelete}
        />
      )}

      <DialogModal
        isOpen={!!photoToDelete}
        type="confirm"
        title="Delete Photo"
        message="Are you sure you want to delete this asset from the archive? This action cannot be undone."
        onConfirm={confirmDeletePhoto}
        onClose={() => setPhotoToDelete(null)}
      />
    </main>
  )
}
