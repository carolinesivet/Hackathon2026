// src/pages/admin/AdminShell.jsx
import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Toast } from '../../components/ui'
import AdminSidebar from './AdminSidebar'
import AdminOverview from './AdminOverview'
import AdminDepartments from './AdminDepartments'
import AdminHODs from './AdminHODs'
import AdminDeptData from './AdminDeptData'
import AdminSettings from './AdminSettings'

export default function AdminShell() {
  const [section,   setSection]   = useState('overview')
  const [toast,     setToast]     = useState(null)
  const [activeDept, setActiveDept] = useState(null) // { id, name, stream }

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }, [])

  const navigateToDept = useCallback((dept) => {
    setActiveDept(dept)
    setSection('dept-data')
  }, [])

  const renderContent = () => {
    switch (section) {
      case 'overview':    return <AdminOverview onNavigateDept={navigateToDept} onToast={showToast} />
      case 'departments': return <AdminDepartments onNavigateDept={navigateToDept} onToast={showToast} />
      case 'hods':        return <AdminHODs onToast={showToast} />
      case 'dept-data':   return <AdminDeptData dept={activeDept} onToast={showToast} />
      case 'settings':    return <AdminSettings onToast={showToast} />
      default:            return <AdminOverview onNavigateDept={navigateToDept} onToast={showToast} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050c16' }}>
      <AdminSidebar
        activeSection={section}
        onNavigate={setSection}
        activeDept={activeDept}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader section={section} activeDept={activeDept} />
        <main style={{ flex: 1, padding: '26px 28px', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
      {toast && (
        <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}

function AdminHeader({ section, activeDept }) {
  const titles = {
    overview:    { label: 'Admin Overview',       icon: '⊞' },
    departments: { label: 'Departments',           icon: '🏛️' },
    hods:        { label: 'HOD Accounts',          icon: '👤' },
    'dept-data': { label: activeDept ? `${activeDept.name} (${activeDept.stream === 'aided' ? 'Aided' : 'Self Finance'})` : 'Department Data', icon: '📊' },
    settings:    { label: 'Portal Settings',       icon: '⚙️' },
  }
  const { label, icon } = titles[section] || titles.overview

  return (
    <header style={{
      height: 56, background: '#07111e',
      borderBottom: '1px solid #162032',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 14, flexShrink: 0,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </span>
      <div style={{ flex: 1 }} />
      <div style={{
        background: '#1a0e00', border: '1px solid #92400e',
        borderRadius: 20, padding: '4px 14px',
        fontSize: 11, color: '#fbbf24', fontFamily: 'monospace', letterSpacing: 1,
      }}>
        ADMIN PANEL
      </div>
    </header>
  )
}
