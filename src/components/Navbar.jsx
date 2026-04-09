import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-mark">◆</span>
          <span className="navbar__logo-text">PicShare</span>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <NavLink to="/trips" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Trips</NavLink>
          <NavLink to="/join"  className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Join</NavLink>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span className="label-caps" title={user.email} style={{ color: 'var(--clr-ink)', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'lowercase' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--clr-accent)' }}>◉</span> {user.email.split('@')[0]}
              </span>
              <button onClick={handleSignOut} className="navbar__link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Sign Out</button>
            </div>
          ) : (
            <Link to="/login" className="navbar__link">Sign In</Link>
          )}
          <Link to="/create" className="btn btn-primary navbar__cta">New Trip</Link>
        </nav>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
