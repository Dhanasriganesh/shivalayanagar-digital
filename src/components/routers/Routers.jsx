import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import StreetPage from '../pages/StreetPage'
import Admin from '../pages/Admin'
import NotFound from '../pages/NotFound'

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/street/:streetId" element={<StreetPage />} />
      {/* Permanent QR-friendly aliases: /street-1 … /street-11 */}
      <Route path="/street-1" element={<StreetPage />} />
      <Route path="/street-2" element={<StreetPage />} />
      <Route path="/street-3" element={<StreetPage />} />
      <Route path="/street-4" element={<StreetPage />} />
      <Route path="/street-5" element={<StreetPage />} />
      <Route path="/street-6" element={<StreetPage />} />
      <Route path="/street-7" element={<StreetPage />} />
      <Route path="/street-8" element={<StreetPage />} />
      <Route path="/street-9" element={<StreetPage />} />
      <Route path="/street-10" element={<StreetPage />} />
      <Route path="/street-11" element={<StreetPage />} />
      <Route path="/admin-san" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers
