// src/pages/admin/AdminHODs.jsx
import { useState, useEffect } from 'react'
import { fetchHODs, createHOD, deleteHOD, fetchDepartments } from '../../api/formApi'
import { Card } from '../../components/ui'

export default function AdminHODs({ onToast }) {
  const [hods,    setHods]    = useState([])
  const [depts,   setDepts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ username: '', password: '', email: '', department_id: '' })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([fetchHODs(), fetchDepartments()])
      .then(([h, d]) => {
        setHods(h)
        // only show depts that don't already have a HOD
        setDepts(d.filter(dept => !dept.hod_username))
      })
      .catch(() => onToast('Failed to load', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    const { username, password, department_id } = form
    if (!username || !password || !department_id) {
      setError('Username, password, and department are all required'); return
    }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setSaving(true)
    try {
      await createHOD({ ...form, department_id: parseInt(department_id) })
      onToast(`HOD account created for ${form.username}`, 'success')
      setForm({ username: '', password: '', email: '', department_id: '' })
      load()
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create HOD'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (hod) => {
    if (!window.confirm(`Delete HOD account "${hod.username}"? This does NOT delete their data.`)) return
    try {
      await deleteHOD(hod.id)
      onToast(`HOD ${hod.username} deleted`, 'success')
      load()
    } catch {
      onToast('Failed to delete HOD', 'error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#060d18',
    border: '1.5px solid #1e293b', borderRadius: 8, color: '#e2e8f0',
    fontSize: 14, outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: 'border-box', transition: 'border-color .2s',
  }
  const labelStyle = {
    display: 'block', fontSize: 11, color: '#64748b', marginBottom: 5,
    letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
      {/* Create form */}
      <Card style={{ padding: 26 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20, fontFamily: 'monospace' }}>
          CREATE HOD ACCOUNT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. bca_hod"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#d97706'}
                onBlur={e => e.target.style.borderColor = '#1e293b'}
              />
            </div>
            <div>
              <label style={labelStyle}>Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="hod@college.edu"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#d97706'}
                onBlur={e => e.target.style.borderColor = '#1e293b'}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                style={{ ...inputStyle, paddingRight: 48 }}
                onFocus={e => e.target.style.borderColor = '#d97706'}
                onBlur={e => e.target.style.borderColor = '#1e293b'}
              />
              <button
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 14,
                }}
              >{showPwd ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Assign to Department</label>
            <select
              value={form.department_id}
              onChange={e => setForm({ ...form, department_id: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            >
              <option value="">— Select a department —</option>
              {depts.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.stream_display})</option>
              ))}
            </select>
            {depts.length === 0 && !loading && (
              <div style={{ fontSize: 11, color: '#f97316', marginTop: 6 }}>
                All departments already have HODs, or no departments exist yet.
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fca5a5' }}>
              ✕ {error}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              padding: '11px 0', borderRadius: 8, border: 'none', cursor: saving ? 'wait' : 'pointer',
              background: 'linear-gradient(135deg,#92400e,#d97706)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: saving ? 0.7 : 1,
              alignSelf: 'flex-start', paddingLeft: 24, paddingRight: 24,
            }}
          >
            {saving ? 'Creating…' : 'Create HOD Account'}
          </button>
        </div>
      </Card>

      {/* HOD list */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ACTIVE HOD ACCOUNTS ({hods.length})
        </div>
        {loading ? (
          <div style={{ color: '#475569' }}>Loading…</div>
        ) : hods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#334155', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No HOD accounts yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hods.map(hod => (
              <div key={hod.id} style={{
                background: '#060d18', border: '1px solid #1e293b',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#1e3a5f,#1e4080)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: '#7dd3fc', fontWeight: 700,
                }}>
                  {hod.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {hod.username}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{hod.email || 'No email'}</div>
                </div>
                <div>
                  {hod.department ? (
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#38bdf8' }}>
                      🏛️ {hod.department}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: '#f97316', fontFamily: 'monospace' }}>No dept</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(hod)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: '1px solid #7f1d1d',
                    background: '#1a0000', color: '#fca5a5', cursor: 'pointer', fontSize: 12,
                  }}
                >Remove</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
