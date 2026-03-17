// src/pages/admin/AdminDepartments.jsx
import { useState, useEffect } from 'react'
import { fetchDepartments, createDepartment, deleteDepartment } from '../../api/formApi'
import { Card, Button } from '../../components/ui'

const STREAM_OPTIONS = [
  { value: 'aided',        label: 'Aided' },
  { value: 'self_finance', label: 'Self Finance' },
]

export default function AdminDepartments({ onNavigateDept, onToast }) {
  const [depts,   setDepts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ name: '', stream: 'aided' })
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const load = () => {
    setLoading(true)
    fetchDepartments()
      .then(setDepts)
      .catch(() => onToast('Failed to load departments', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) { setError('Department name is required'); return }
    setError(''); setSaving(true)
    try {
      await createDepartment(form)
      onToast(`${form.name} (${STREAM_OPTIONS.find(s => s.value === form.stream)?.label}) created`, 'success')
      setForm({ name: '', stream: 'aided' })
      load()
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Already exists or error'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete ${dept.name} (${dept.stream_display})? This will delete ALL data for this department.`)) return
    try {
      await deleteDepartment(dept.id)
      onToast(`${dept.name} deleted`, 'success')
      load()
    } catch {
      onToast('Failed to delete department', 'error')
    }
  }

  const inputStyle = {
    padding: '10px 14px', background: '#060d18', border: '1.5px solid #1e293b',
    borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box',
    transition: 'border-color .2s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700 }}>
      {/* Create form */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ADD NEW DEPARTMENT
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 5, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>
              Department Name
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. BCA, BCom, BSc"
              style={{ ...inputStyle, width: '100%' }}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 5, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>
              Stream
            </label>
            <select
              value={form.stream}
              onChange={e => setForm({ ...form, stream: e.target.value })}
              style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#d97706'}
              onBlur={e => e.target.style.borderColor = '#1e293b'}
            >
              {STREAM_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: saving ? 'wait' : 'pointer',
              background: 'linear-gradient(135deg,#92400e,#d97706)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Adding…' : '+ Add Department'}
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 10, color: '#fca5a5', fontSize: 12, background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: '8px 14px' }}>
            ✕ {error}
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 12, color: '#334155', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
          💡 You can add the same department twice with different streams — e.g. BCom (Aided) and BCom (Self Finance) are tracked separately.
        </div>
      </Card>

      {/* List */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, fontFamily: 'monospace' }}>
          ALL DEPARTMENTS ({depts.length})
        </div>
        {loading ? (
          <div style={{ color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading…</div>
        ) : depts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#334155', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No departments yet. Add one above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {depts.map(dept => (
              <div key={dept.id} style={{
                background: '#060d18', border: '1px solid #1e293b',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <div style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {dept.name}
                  </div>
                  <div style={{ fontSize: 11, color: dept.stream === 'aided' ? '#22c55e' : '#818cf8', fontFamily: 'monospace', fontWeight: 700 }}>
                    {dept.stream_display}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: dept.hod_username ? '#38bdf8' : '#f97316', fontFamily: 'monospace' }}>
                  {dept.hod_username ? `👤 ${dept.hod_username}` : '⚠ No HOD assigned'}
                </div>
                <div style={{ fontSize: 11, color: dept.is_submitted ? '#22c55e' : '#475569', fontFamily: 'monospace' }}>
                  {dept.is_submitted ? '✓ Submitted' : '○ Pending'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onNavigateDept(dept)}
                    style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid #1e3a5f',
                      background: '#0a1929', color: '#7dd3fc', cursor: 'pointer', fontSize: 12,
                    }}
                  >View</button>
                  <button
                    onClick={() => handleDelete(dept)}
                    style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid #7f1d1d',
                      background: '#1a0000', color: '#fca5a5', cursor: 'pointer', fontSize: 12,
                    }}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
