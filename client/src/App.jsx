import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import NewListing from './pages/NewListing'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

// Wrapper: redirect to /login if not logged in
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// Wrapper: redirect to /listings if already logged in
function GuestRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/listings" replace />
}

// Wrapper: redirect to / if not admin
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public: login & register only */}
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Protected: must be logged in */}
            <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="listings" element={<PrivateRoute><Listings /></PrivateRoute>} />
            <Route path="listings/:id" element={<PrivateRoute><ListingDetail /></PrivateRoute>} />
            <Route path="new" element={<PrivateRoute><NewListing /></PrivateRoute>} />

            {/* Admin only */}
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
