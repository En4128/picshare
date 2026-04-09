import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Upload.css'

export default function Upload() {
  const { id } = useParams()
  const [dragActive, setDragActive] = useState(false)
  const [uploadQueue, setUploadQueue] = useState([]) // shape: { name, progress, completed, error }
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return
    
    // Add files to UI queue
    const newItems = Array.from(files).map(file => ({
      name: file.name,
      file,
      progress: 0,
      completed: false,
      error: null
    }))
    
    setUploadQueue(prev => [...newItems, ...prev])
    setIsUploading(true)

    // Process files one by one
    for (const item of newItems) {
      try {
        const fileExt = item.file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${id}/${fileName}`
        
        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('picshare')
          .upload(filePath, item.file)
          
        if (uploadError) throw uploadError
        
        // 2. Get public URL of uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('picshare')
          .getPublicUrl(filePath)
          
        // 3. Insert record into Supabase 'photos' table
        const { error: dbError } = await supabase
          .from('photos')
          .insert([{ trip_id: id, url: publicUrl }])
          
        if (dbError) throw dbError
        
        // Mark as completed in UI
        setUploadQueue(prev => prev.map(q => q.name === item.name ? { ...q, progress: 100, completed: true } : q))
        
      } catch (err) {
        console.error("Upload error:", err.message)
        // Mark as errored in UI
        setUploadQueue(prev => prev.map(q => q.name === item.name ? { ...q, error: err.message } : q))
      }
    }
    
    setIsUploading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files) {
      uploadFiles(e.dataTransfer.files)
    }
  }
  
  const handleChange = (e) => {
    if (e.target.files) {
      uploadFiles(e.target.files)
    }
  }

  return (
    <main className="upload-page page-pad">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header & Subnav */}
        <div className="dashboard__header fade-up">
          <div className="dashboard__header-left">
            <span className="label-caps">Current Expedition</span>
            <h1 className="display-md" style={{ marginTop: '0.4rem' }}>Managing Assets</h1>
          </div>
        </div>

        <nav className="dashboard__subnav fade-up fade-up-d1">
          <Link to={`/trips/${id}`}           className="dashboard__subnav-link">Gallery</Link>
          <Link to={`/trips/${id}/favorites`} className="dashboard__subnav-link">Favorites</Link>
          <Link to={`/trips/${id}/upload`}    className="dashboard__subnav-link active">Upload</Link>
        </nav>

        <div className="upload-content fade-up fade-up-d2">
          <div className="upload-header">
            <h2 className="headline" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Archive</h2>
            <p style={{ color: 'var(--clr-ink-muted)' }}>
              Manage and curate your captured experiences. All assets are processed through our high-fidelity archival system.
            </p>
          </div>

          <label
            className={`upload__dropzone ${dragActive ? 'upload__dropzone--active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ cursor: 'pointer', display: 'block' }}
          >
            <div className="upload__drop-icon">✦</div>
            <h3 className="headline">Drag and drop files</h3>
            <span className="label-caps" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Support for high-res images</span>
            <div className="upload__drop-or">
              <span className="label-caps">or</span>
            </div>
            
            <span className="btn btn-ghost">Browse Files</span>
            <input 
              type="file" 
              multiple 
              onChange={handleChange} 
              style={{ display: 'none' }}
              accept="image/*"
            />
          </label>

          <div className="upload__queue">
            <h4 className="label-caps" style={{ marginBottom: '1rem' }}>Upload Queue {isUploading && '(Processing...)'}</h4>
            
            {uploadQueue.length === 0 && (
              <p style={{ color: 'var(--clr-ink-muted)', fontSize: '0.9rem' }}>No files queued for upload.</p>
            )}
            
            {uploadQueue.map((item, idx) => (
              <div key={idx + item.name} className="upload__queue-item">
                <div className="upload__queue-item-info">
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                    {item.name}
                  </span>
                  
                  <span style={{ 
                    color: item.error ? 'var(--clr-error)' : (item.completed ? 'var(--clr-success)' : 'var(--clr-ink-muted)'),
                    fontSize: '0.85rem' 
                  }}>
                    {item.error ? "Failed" : (item.completed ? 'Completed' : 'Uploading...')}
                  </span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: item.error ? '100%' : (item.completed ? '100%' : '30%'), 
                      background: item.error ? 'var(--clr-error)' : (item.completed ? 'var(--clr-success)' : 'var(--clr-accent)'),
                      animation: (!item.completed && !item.error) ? 'pulse 1s infinite alternate' : 'none'
                    }} 
                  />
                </div>
                {item.error && <div style={{ color: 'var(--clr-error)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{item.error}</div>}
              </div>
            ))}

          </div>

        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}} />
    </main>
  )
}
