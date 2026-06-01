import { useState, useEffect, useRef } from 'react'

export default function DialogModal({ isOpen, type, title, message, defaultValue = '', onConfirm, onClose }) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue)
      // Focus and select the input automatically for a good user experience
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 50)
    }
  }, [isOpen, defaultValue])

  // Handle keyboard events (Escape to cancel)
  useEffect(() => {
    if (!isOpen) return
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
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(type === 'prompt' ? inputValue : true)
  }

  const isDeleteAction = title.toLowerCase().includes('delete')

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '440px', padding: '1.75rem', overflowY: 'visible' }}>
        <h3 className="headline" style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--clr-ink-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <form onSubmit={handleSubmit}>
          {type === 'prompt' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                ref={inputRef}
                type="text"
                className="input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{ padding: '0.6rem 1.25rem', textTransform: 'uppercase', fontSize: '0.75rem', height: 'auto' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              style={{
                padding: '0.6rem 1.25rem',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                height: 'auto',
                backgroundColor: isDeleteAction ? 'var(--clr-error)' : 'var(--clr-ink)',
                color: '#fff'
              }}
            >
              {isDeleteAction ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
