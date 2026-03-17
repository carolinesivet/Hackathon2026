import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/login'
import DashboardShell from './pages/DashboardShell'
import AdminShell from './pages/admin/AdminShell'
import { Spinner } from './components/ui'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#050c16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <Spinner size={40} />
      <span style={{ color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 }}>
        Loading IQAC Portal…
      </span>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function RoleRouter() {
  const { user, loading, isAdmin, isHOD } = useAuth()
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#050c16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <Spinner size={40} />
      <span style={{ color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 }}>
        Loading IQAC Portal…
      </span>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (isAdmin) return <AdminShell />
  if (isHOD)   return <DashboardShell />
  // Fallback — unknown role
  return (
    <div style={{
      minHeight: '100vh', background: '#050c16', color: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif", flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div>Your account has no role assigned. Contact the admin.</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Login />} />
          {/* Remove /register — admin creates accounts */}
          <Route path="/dashboard" element={<RoleRouter />} />
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
