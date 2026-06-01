import { Link } from 'react-router-dom'
import './Landing.css'

const FEATURES = [
  {
    icon: '✦',
    title: 'Create',
    body: 'Name your trip, set your dates, and invite your fellow travelers to the collective journal.',
  },
  {
    icon: '◈',
    title: 'Upload',
    body: 'Drop your high-res photos and videos. Our system organizes them by location and time.',
  },
  {
    icon: '◎',
    title: 'Share',
    body: 'Generate a beautiful link or QR code to share your editorialized trip with the world.',
  },
]

const HIGHLIGHTS = [
  {
    title: 'Smart Tonal Matching',
    body: 'Every photo is analyzed for color and composition to ensure your grid looks balanced.',
  },
  {
    title: 'Real-time Syncing',
    body: 'Invite companions to add their shots as they happen. No more chasing photos via apps.',
  },
  {
    title: 'Private & Secure',
    body: 'Control exactly who sees your journey with link-level permissions and expirations.',
  },
]

const SAMPLE_TRIPS = [
  { id: 'demo-1', label: 'Italian Dolomites 2024', shots: 142, colorA: '#d4e8d0', colorB: '#a8c5a0', image: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=800&auto=format&fit=crop' },
  { id: 'demo-2', label: 'Kyoto in Autumn', shots: 98, colorA: '#f0d9c8', colorB: '#d4a87a', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop' },
  { id: 'demo-3', label: 'Patagonia Trek', shots: 215, colorA: '#c8d8e8', colorB: '#7aa8c8', image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?q=80&w=800&auto=format&fit=crop' },
]

export default function Landing() {
  return (
    <main className="landing">
      {/* ---- Hero ---- */}
      <section className="landing__hero">
        <div className="container">
          <div className="landing__hero-inner">
            <div className="landing__hero-text fade-up">
              <span className="label-caps landing__eyebrow">The Curated Journal</span>
              <h1 className="display-xl landing__headline">
                Capture &amp;<br />
                <em>Share Your</em><br />
                Trip Memories
              </h1>
              <p className="landing__sub">
                Transform your adventures into editorial visual journals.
                Connect with friends through real-time shared albums.
              </p>
              <div className="landing__hero-actions fade-up fade-up-d2">
                <Link to="/create" className="btn btn-primary">Start a Trip</Link>
                <Link to="/join"   className="btn btn-ghost">Join with Code</Link>
              </div>
            </div>
            <div className="landing__hero-album fade-up fade-up-d1">
              <div className="landing__album-card landing__album-card--main">
                <div className="img-ratio ratio-3-2">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop" 
                    alt="Mountain landscape travel memory" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="landing__album-meta">
                  <span className="label-caps">Live</span>
                  <span className="tag tag-accent">142 shots</span>
                </div>
              </div>
              <div className="landing__album-card landing__album-card--float">
                <div className="img-ratio ratio-4-5">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD5KggmEcCxdJ2LFrDloUVCayDxcIWQdVRtA&s"
                    alt="Kyoto travel memory"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing__hero-grain" />
      </section>

      {/* ---- How it Works ---- */}
      <section className="landing__how">
        <div className="container">
          <div className="landing__section-header">
            <span className="label-caps">Process</span>
            <h2 className="display-md">How it Works</h2>
            <p className="landing__section-sub">
              Capture memories without the friction of traditional social media.
              Focus on the moment — we handle the curation.
            </p>
          </div>
          <div className="landing__features">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`landing__feature card fade-up fade-up-d${i + 1}`}>
                <div className="landing__feature-icon">{f.icon}</div>
                <h3 className="headline landing__feature-title">{f.title}</h3>
                <p className="landing__feature-body">{f.body}</p>
                <span className="landing__feature-num">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Live Preview ---- */}
      <section className="landing__preview">
        <div className="container">
          <span className="label-caps">Live Albums</span>
          <h2 className="display-md" style={{ margin: '0.75rem 0 2.5rem' }}>Your Memories, Elevated to Art</h2>
          <div className="landing__preview-grid">
            {SAMPLE_TRIPS.map((t) => (
              <Link to={`/trips/${t.id}`} key={t.id} className="landing__preview-card card">
                <div className="img-ratio ratio-4-5">
                  <img
                    src={t.image}
                    alt={t.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
                <div className="landing__preview-info">
                  <p className="headline" style={{ fontSize: '1.1rem' }}>{t.label}</p>
                  <span className="tag">{t.shots} photos</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Highlights ---- */}
      <section className="landing__highlights">
        <div className="container">
          <div className="landing__highlights-grid">
            {HIGHLIGHTS.map((h, i) => (
              <div key={h.title} className={`fade-up fade-up-d${i + 1}`}>
                <h3 className="headline landing__hl-title">{h.title}</h3>
                <p className="landing__hl-body">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Strip ---- */}
      <section className="landing__cta-strip">
        <div className="container landing__cta-inner">
          <h2 className="display-lg">Ready to begin<br /><em>your archive?</em></h2>
          <Link to="/create" className="btn btn-primary landing__cta-btn">Launch a Trip ◆</Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="landing__footer">
        <div className="container landing__footer-inner">
          <span className="navbar__logo-text" style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:600 }}>
            ◆ PicShare
          </span>
          <span className="label-caps">© 2024 PicShare. All rights reserved.</span>
          <div className="landing__footer-links">
            <a href="#" className="label-caps">Privacy</a>
            <a href="#" className="label-caps">Terms</a>
            <a href="#" className="label-caps">Cookies</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
