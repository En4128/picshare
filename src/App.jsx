import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import Trips from './pages/Trips.jsx'
import TripDashboard from './pages/TripDashboard.jsx'

import Favorites from './pages/Favorites.jsx'
import Upload from './pages/Upload.jsx'
import SharePage from './pages/SharePage.jsx'
import JoinTrip from './pages/JoinTrip.jsx'
import CreateTrip from './pages/CreateTrip.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDashboard />} />

          <Route path="/trips/:id/favorites" element={<Favorites />} />
          <Route path="/trips/:id/upload" element={<Upload />} />
          <Route path="/trips/:id/share" element={<SharePage />} />
          <Route path="/join" element={<JoinTrip />} />
          <Route path="/create" element={<CreateTrip />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
