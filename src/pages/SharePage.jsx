import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

export default function SharePage() {
  const { id } = useParams()
  const [copiedLink, setCopiedLink]   = useState(false)
  const [copiedCode, setCopiedCode]   = useState(false)
  const [activeTab, setActiveTab]     = useState('qr') // 'qr' | 'link' | 'code'
  const qrRef = useRef(null)

  const directUrl = `${window.location.origin}/trips/${id}`
  const joinUrl   = `${window.location.origin}/join`

  const copy = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svgEl = qrRef.current?.querySelector('svg')
    if (!svgEl) return
    const svgData  = new XMLSerializer().serializeToString(svgEl)
    const canvas   = document.createElement('canvas')
    const ctx      = canvas.getContext('2d')
    const img      = new Image()
    const size     = 360
    canvas.width   = size
    canvas.height  = size
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const a    = document.createElement('a')
      a.download = `picshare-trip-${id.slice(0, 8)}.png`
      a.href     = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  const tabs = [
    { id: 'qr',   label: '⬚  QR Code' },
    { id: 'link', label: '🔗  Direct Link' },
    { id: 'code', label: '🔑  Invite Code' },
  ]

  return (
    <main className="share-page page-pad">
      <div className="container" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>

        {/* Header */}
        <div className="fade-up">
          <span className="label-caps">The Alchemist's Path</span>
          <h1 className="display-md" style={{ margin: 'var(--sp-2) 0 var(--sp-3)' }}>Share Your Expedition</h1>
          <p style={{ color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-6)', fontSize: '1rem', lineHeight: 1.7 }}>
            Invite others to view this trip by scanning the QR code, sharing the link, or sending the invite code.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="fade-up fade-up-d1" style={{
          display: 'flex',
          borderBottom: '1px solid var(--clr-border)',
          marginBottom: 'var(--sp-5)',
          gap: '0'
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                fontSize: '0.8rem',
                fontWeight: activeTab === t.id ? 600 : 400,
                color: activeTab === t.id ? 'var(--clr-ink)' : 'var(--clr-ink-muted)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '2px solid var(--clr-ink)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.03em'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── QR Code Tab ── */}
        {activeTab === 'qr' && (
          <div className="card fade-up" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-5)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-2)' }}>
              Point any camera at this code to open the trip gallery instantly.
            </p>

            {/* QR Display */}
            <div ref={qrRef} style={{
              padding: '1.5rem',
              background: '#fff',
              borderRadius: 'var(--r-md)',
              boxShadow: 'var(--shadow-md)',
              display: 'inline-block',
              lineHeight: 0
            }}>
              <QRCodeSVG
                value={directUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="H"
                includeMargin={false}
              />
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--clr-ink-muted)', wordBreak: 'break-all', maxWidth: '340px' }}>
              {directUrl}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={downloadQR}>
                ↓ Download QR
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => copy(directUrl, setCopiedLink)}
              >
                {copiedLink ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}

        {/* ── Direct Link Tab ── */}
        {activeTab === 'link' && (
          <div className="card fade-up" style={{ padding: 'var(--sp-5)', textAlign: 'left' }}>
            <h3 className="headline" style={{ marginBottom: '0.4rem', fontSize: '1.2rem' }}>Direct Link</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-4)' }}>
              Guests click this link and land straight in the trip gallery — no code needed.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.9rem 1rem',
              background: 'var(--clr-surface-low)',
              borderRadius: 'var(--r-sm)'
            }}>
              <code style={{ fontSize: '0.82rem', color: 'var(--clr-ink-muted)', wordBreak: 'break-all', flex: 1 }}>
                {directUrl}
              </code>
              <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                onClick={() => copy(directUrl, setCopiedLink)}
              >
                {copiedLink ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* ── Invite Code Tab ── */}
        {activeTab === 'code' && (
          <div className="card fade-up" style={{ padding: 'var(--sp-5)', textAlign: 'left' }}>
            <h3 className="headline" style={{ marginBottom: '0.4rem', fontSize: '1.2rem' }}>Invite Code</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-ink-muted)', marginBottom: 'var(--sp-4)' }}>
              Share this code — guests paste it at <strong>{joinUrl}</strong> to enter the archive.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.9rem 1rem',
              background: 'var(--clr-surface-low)',
              borderRadius: 'var(--r-sm)'
            }}>
              <code style={{ fontSize: '0.82rem', color: 'var(--clr-ink)', wordBreak: 'break-all', flex: 1, fontWeight: 500 }}>
                {id}
              </code>
              <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                onClick={() => copy(id, setCopiedCode)}
              >
                {copiedCode ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'var(--sp-6)' }}>
          <Link to={`/trips/${id}`} className="btn btn-ghost fade-up fade-up-d2">← Back to Dashboard</Link>
        </div>

      </div>
    </main>
  )
}
