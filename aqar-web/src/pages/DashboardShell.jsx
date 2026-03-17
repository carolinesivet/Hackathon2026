import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { ResponseProvider, useResponses } from '../context/ResponseContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Dashboard from './dashboard'
import CriterionPage from './criteria/CriterionPage'
import Reports from './reports'
import Settings from './settings'
import { Toast, Spinner } from '../components/ui'
import { CRITERIA } from '../utils/naacData'

const criterionKeys = CRITERIA.map(c => c.key)

function AppShell() {
  const [section,          setSection]          = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast,            setToast]            = useState(null)
  const [submitting,       setSubmitting]        = useState(false)
  const [confirmSubmit,    setConfirmSubmit]     = useState(false)

  const { isSubmitted, submittedAt, submitAllData, responses, collegeName, aqarYear } = useResponses()
  const { user } = useAuth()

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }, [])

  const navigate = useCallback((key) => setSection(key), [])

  const handleSubmit = async () => {
    setSubmitting(true)
    const result = await submitAllData()
    setSubmitting(false)
    setConfirmSubmit(false)
    if (result.success) {
      showToast('Data submitted to Admin successfully! Editing is now locked.', 'success')
    } else {
      showToast(result.error || 'Submission failed', 'error')
    }
  }

  const renderContent = () => {
    if (section === 'dashboard') return <Dashboard onNavigate={navigate} />
    if (section === 'reports')   return <Reports onToast={showToast} />
    if (section === 'settings')  return <Settings onToast={showToast} />
    if (criterionKeys.includes(section)) return (
      <CriterionPage criterionKey={section} onToast={showToast} readOnly={isSubmitted} />
    )
    return <Dashboard onNavigate={navigate} />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050c16' }}>
      <Sidebar
        activeSection={section}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          activeSection={section}
          onToggleSidebar={() => setSidebarCollapsed(c => !c)}
        />

        {/* Lock banner */}
        {isSubmitted && (
          <div style={{
            background: '#052e16', borderBottom: '1px solid #16a34a',
            padding: '10px 24px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, color: '#86efac', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Data submitted to Admin
              </span>
              {submittedAt && (
                <span style={{ fontSize: 11, color: '#4ade80', marginLeft: 10, fontFamily: 'monospace' }}>
                  {new Date(submittedAt).toLocaleString()}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12, color: '#4ade80', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Contact admin to unlock for editing
            </span>
          </div>
        )}

        {/* HOD dept info bar */}
        {user?.department && (
          <div style={{
            background: '#07111e', borderBottom: '1px solid #162032',
            padding: '6px 24px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 11, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Department:
            </span>
            <span style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700, fontFamily: 'monospace' }}>
              {user.department}
            </span>
            <span style={{ fontSize: 11, color: user.stream === 'aided' ? '#22c55e' : '#818cf8', fontFamily: 'monospace', fontWeight: 700 }}>
              ({user.stream === 'aided' ? 'Aided' : 'Self Finance'})
            </span>
          </div>
        )}

        <main style={{ flex: 1, padding: '26px 28px', overflowY: 'auto', overflowX: 'hidden' }}>
          {renderContent()}
        </main>

        {/* Submit footer */}
        {!isSubmitted && (
          <div style={{
            background: '#07111e', borderTop: '1px solid #162032',
            padding: '14px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                When all data is complete, submit to your AQAR Cell Head for review.
              </span>
            </div>
            <button
              onClick={() => setConfirmSubmit(true)}
              style={{
                padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#15803d,#22c55e)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 4px 14px #22c55e30',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>📤</span> Submit to Admin
            </button>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirmSubmit && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
        }}>
          <div style={{
            background: '#0a1520', border: '1px solid #1e3a5f',
            borderRadius: 16, padding: '32px 36px', maxWidth: 440, width: '100%',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          }}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16 }}>📤</div>
            <h3 style={{ margin: '0 0 10px', color: '#f1f5f9', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20 }}>
              Submit to Admin?
            </h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', textAlign: 'center', fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
              Once submitted, <strong style={{ color: '#fbbf24' }}>you will not be able to edit any data</strong> unless the admin unlocks it. Make sure everything is complete.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmSubmit(false)}
                style={{
                  padding: '10px 24px', borderRadius: 8,
                  background: '#1e293b', border: 'none', color: '#94a3b8',
                  cursor: 'pointer', fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '10px 28px', borderRadius: 8,
                  background: 'linear-gradient(135deg,#15803d,#22c55e)',
                  border: 'none', color: '#fff', cursor: submitting ? 'wait' : 'pointer',
                  fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? <><Spinner size={16} /> Submitting…</> : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ResponseProvider>
      <AppShell />
    </ResponseProvider>
  )
}
