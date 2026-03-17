// src/pages/admin/AdminSettings.jsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { saveSettings, fetchSettings } from '../../api/formApi'
import { Card, Button } from '../../components/ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const YEARS_OPTS = ['2021-22', '2022-23', '2023-24', '2024-25']

export default function AdminSettings({ onToast }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [name,   setName]   = useState('')
  const [year,   setYear]   = useState('2023-24')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings().then(s => {
      if (s.college_name) setName(s.college_name)
      if (s.aqar_year)    setYear(s.aqar_year)
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSettings({ college_name: name, aqar_year: year })
      onToast('Settings saved!', 'success')
    } catch {
      onToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#060d18', border: '1.5px solid #1e293b',
    borderRadius: 9, color: '#e2e8f0', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color .2s',
  }
  const labelStyle = {
    display: 'block', fontSize: 11, color: '#64748b', marginBottom: 6,
    letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600,
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
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            />
          </div>
          <div>
            <label style={labelStyle}>AQAR Year</label>
            <select
              value={year} onChange={e => setYear(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            >
              {YEARS_OPTS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '11px 24px', borderRadius: 8, border: 'none',
            cursor: saving ? 'wait' : 'pointer',
            background: 'linear-gradient(135deg,#92400e,#d97706)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            alignSelf: 'flex-start', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </Card>

      <Card style={{ padding: 26 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ADMIN ACCOUNT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg,#92400e,#d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', fontWeight: 800,
          }}>
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 15, color: '#f1f5f9', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.username}</div>
            <div style={{ fontSize: 12, color: '#d97706' }}>AQAR Cell Head (Admin)</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          padding: '8px 18px', borderRadius: 8, border: '1px solid #7f1d1d',
          background: '#1a0000', color: '#fca5a5', cursor: 'pointer',
          fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
        }}>
          Sign Out
        </button>
      </Card>
    </div>
  )
}
