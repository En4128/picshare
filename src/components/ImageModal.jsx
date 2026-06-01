import { useEffect } from 'react'
import './ImageModal.css'

export default function ImageModal({ photo, onClose, isFavorite, onToggleFavorite, onDelete }) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // Prevent scrolling behind the modal
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!photo) return null

  // Format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date unknown'
    }
  }

  // Handle direct file download
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      
      // Determine file extension from URL
      const extension = photo.url.split('.').pop().split('?')[0] || 'jpg'
      link.download = `picshare-photo-${photo.id}.${extension}`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("Failed to download image directly:", err)
      // Fallback: Open in new tab
      window.open(photo.url, '_blank')
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="image-modal__content">
        
        {/* Left Side: Photo display */}
        <div className="image-modal__img-container">
          <img 
            src={photo.url} 
            alt="Expanded view of travel memory" 
            className="image-modal__img" 
          />
        </div>

        {/* Right Side: Sidebar details */}
        <div className="image-modal__sidebar">
          
          <div>
            <div className="image-modal__header">
              <div>
                <span className="label-caps">Memory Detail</span>
                <h3 className="headline" style={{ marginTop: '0.2rem' }}>Archived Asset</h3>
              </div>
              <button 
                className="image-modal__close-btn" 
                onClick={onClose}
                title="Close overlay"
              >
                ✕
              </button>
            </div>

            <div className="image-modal__meta">
              <div className="image-modal__meta-item">
                <span className="image-modal__meta-label">Uploaded At</span>
                <span className="image-modal__meta-value">{formatDate(photo.created_at)}</span>
              </div>
              {photo.color_hex && (
                <div className="image-modal__meta-item">
                  <span className="image-modal__meta-label">Vibe Palette</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        background: photo.color_hex, 
                        border: '1px solid var(--clr-surface-mid)' 
                      }} 
                    />
                    <span className="image-modal__meta-value" style={{ fontFamily: 'monospace' }}>
                      {photo.color_hex}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="image-modal__actions">
            <div className="image-modal__actions-row">
              <button 
                className="image-modal__btn image-modal__btn-download"
                onClick={handleDownload}
              >
                <span>📥</span> Download
              </button>

              <button 
                className={`image-modal__btn image-modal__btn-fav ${isFavorite ? 'is-fav' : ''}`}
                onClick={() => onToggleFavorite(photo.id)}
              >
                <span>{isFavorite ? '♥' : '♡'}</span> {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
            </div>

            {onDelete && (
              <button 
                className="image-modal__btn image-modal__btn-delete"
                onClick={() => {
                  onDelete(photo)
                  onClose()
                }}
              >
                <span>🗑️</span> Delete from Archive
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
