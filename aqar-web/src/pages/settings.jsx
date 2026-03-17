import { useState } from 'react'
import { useResponses } from '../context/ResponseContext'
import { useAuth } from '../context/AuthContext'
import { Card, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'

const YEARS_OPTS = ['2021-22', '2022-23', '2023-24', '2024-25']

export default function Settings({ onToast }) {
  const { collegeName, aqarYear, saveCollegeSettings } = useResponses()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(collegeName)
  const [year, setYear] = useState(aqarYear)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const result = await saveCollegeSettings(name, year)
    setSaving(false)
    if (result?.success) {
      onToast('Settings saved!', 'success')
    } else {
      onToast('Failed to save settings — please try again.', 'error')
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#060d18', border: '1.5px solid #1e293b',
    borderRadius: 9, color: '#e2e8f0',
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color .2s',
  }

  const labelStyle = {
    display: 'block', fontSize: 11, color: '#64748b',
    marginBottom: 6, letterSpacing: 0.5,
    textTransform: 'uppercase', fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>

      <Card style={{ padding: 26 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, fontFamily: 'monospace' }}>
          INSTITUTION SETTINGS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>College / Institution Name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. ABC Arts & Science College"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            />
          </div>

          <div>
            <label style={labelStyle}>AQAR Year</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            >
              {YEARS_OPTS.map(y => (
                <option key={y} value={y} style={{ background: '#0f172a' }}>{y}</option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </Card>

      <Card style={{ padding: 26 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ACCOUNT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', fontWeight: 800,
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 15, color: '#f1f5f9', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.username}</div>
            <div style={{ fontSize: 12, color: '#475569' }}>{user?.email || 'IQAC Administrator'}</div>
          </div>
        </div>
        <Button variant="danger" onClick={handleLogout} small>
          Sign Out
        </Button>
      </Card>

      <Card style={{ padding: 26 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ABOUT
        </div>
        <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <strong style={{ color: '#94a3b8' }}>GenAI NAAC AQAR Assistant</strong><br />
          Version 1.0.0 · Open Source<br /><br />
          Supports all 7 NAAC criteria (Part A + Criteria I–VII) with QlM and QnM metric types, live validation, and JSON export.<br /><br />
          <strong style={{ color: '#475569', fontSize: 12 }}>Backend:</strong> <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#334155' }}>Django REST Framework + PostgreSQL</span><br />
          <strong style={{ color: '#475569', fontSize: 12 }}>Frontend:</strong> <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#334155' }}>React + Vite</span><br /><br />
          <span style={{ fontSize: 12, color: '#334155' }}>
            Future: AI-powered QlM generation · NAAC compliance scoring · Document summarization · Draft writing
          </span>
        </div>
      </Card>
    </div>
  )
}