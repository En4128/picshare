import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!tripName) return

    setLoading(true)
    setError(null)

    let date_range = '';
    if (startDate && endDate) {
      date_range = `${formatDateStr(startDate)} – ${formatDateStr(endDate)}`;
    } else if (startDate) {
      date_range = formatDateStr(startDate);
    } else if (endDate) {
      date_range = formatDateStr(endDate);
    }

    try {
      let uploadedUrl = null;
      if (coverFile) {
        // Upload to Supabase Storage
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('picshare')
          .upload(filePath, coverFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('picshare')
          .getPublicUrl(filePath);

        uploadedUrl = publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from('trips')
        .insert([{ title: tripName, date_range: date_range, ...(uploadedUrl && { cover_url: uploadedUrl }) }])
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
            <label className="input-label">Date Range</label>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--clr-ink-muted)', marginBottom: '0.4rem', display: 'block' }}>Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--clr-ink-muted)', height: '48px' }}>—</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--clr-ink-muted)', marginBottom: '0.4rem', display: 'block' }}>End Date</label>
                <input
                  id="endDate"
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <label
            className={`upload__dropzone ${dragActive ? 'upload__dropzone--active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              padding: 'var(--sp-5)',
              border: `1px dashed ${dragActive ? 'var(--clr-accent)' : 'var(--clr-surface-mid)'}`,
              borderRadius: 'var(--r-md)',
              textAlign: 'center',
              marginBottom: 'var(--sp-6)',
              background: dragActive ? 'var(--clr-surface-mid)' : 'var(--clr-surface-low)',
              cursor: 'pointer',
              display: 'block',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {coverPreview ? (
              <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                <img src={coverPreview} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', ':hover': { opacity: 1 } }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <span style={{ color: 'white', fontWeight: 500 }}>Click or Drop to Switch</span>
                </div>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)', display: 'block' }}>🖼️</span>
                <h4 className="label-caps">Drop a Cover Image</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--clr-ink-muted)', marginTop: '0.2rem' }}>Click or drag a high-res JPEG/PNG</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>

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
