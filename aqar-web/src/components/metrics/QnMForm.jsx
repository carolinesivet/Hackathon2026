import { useResponses } from '../../context/ResponseContext'
import { YEARS } from '../../utils/naacData'
import FileUpload from './FileUpload'
import { Button } from '../ui'

export default function QnMForm({ metric, response, onChange, onSave, color }) {
  const { uploadFile, removeDocument } = useResponses()

  const data   = response.data || {}
  const values = YEARS.map(y => ({ year: y, val: data[y] ?? '' }))
  const hasData   = values.some(v => v.val !== '')
  const negatives = values.filter(v => v.val !== '' && parseFloat(v.val) < 0)
  const hasNeg    = negatives.length > 0
  const canSave   = hasData && !hasNeg

  const total = values.reduce((s, v) => s + (parseFloat(v.val) || 0), 0)
  const avg   = hasData
    ? (total / values.filter(v => v.val !== '').length).toFixed(2)
    : 0

  const setVal = (year, val) => {
    onChange({ ...response, data: { ...data, [year]: val }, saved: false })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#060d18' }}>
              {['Academic Year', 'Numeric Value', 'Validation'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px',
                  fontSize: 10, color: '#475569',
                  textTransform: 'uppercase', letterSpacing: 1,
                  fontFamily: 'monospace', borderBottom: '1px solid #1e293b',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map(({ year, val }) => {
              const num     = parseFloat(val)
              const isNeg   = val !== '' && num < 0
              const isValid = val !== '' && !isNeg
              return (
                <tr key={year} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, background: '#0a1929', padding: '5px 12px', borderRadius: 6, color: '#94a3b8' }}>{year}</span>
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <input
                      type="number" value={val} min="0"
                      onChange={e => setVal(year, e.target.value)}
                      placeholder="Enter value"
                      style={{
                        width: 160, padding: '8px 12px',
                        background: '#060d18',
                        border: `1.5px solid ${isNeg ? '#dc2626' : isValid ? color + '60' : '#1e293b'}`,
                        borderRadius: 8, color: '#e2e8f0',
                        fontFamily: 'monospace', fontSize: 15,
                        outline: 'none', transition: 'border-color .2s',
                      }}
                      onFocus={e => e.target.style.borderColor = color}
                      onBlur={e => e.target.style.borderColor = isNeg ? '#dc2626' : isValid ? color + '60' : '#1e293b'}
                    />
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    {isNeg
                      ? <span style={{ color: '#ef4444', fontSize: 12 }}>✕ Negative not allowed</span>
                      : isValid
                        ? <span style={{ color: '#22c55e', fontSize: 12 }}>✓ Valid</span>
                        : <span style={{ color: '#334155', fontSize: 12 }}>— Not entered</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total (Sum)',     value: total.toLocaleString() },
            { label: 'Average / Year', value: avg },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#060d18', border: `1px solid ${color}30`,
              borderRadius: 8, padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: '#64748b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 16, color, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {hasNeg && (
        <div style={{ background: '#1a0000', border: '1px solid #991b1b', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fca5a5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ✕ Negative values are not allowed.
        </div>
      )}

      {/* File upload — directly calls backend */}
      <FileUpload
        documents={response.documents || []}
        onUpload={(file) => uploadFile(metric.id, file)}
        onRemove={(docId, isServerDoc) => removeDocument(metric.id, docId, isServerDoc)}
        accentColor={color}
      />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          onClick={() => canSave && onSave()}
          disabled={!canSave}
          variant={canSave ? 'primary' : 'secondary'}
          style={canSave ? { background: `linear-gradient(135deg,${color},${color}cc)` } : {}}
        >
          {response.saved ? '✓ Saved' : 'Save Response'}
        </Button>
        {!hasData && (
          <span style={{ fontSize: 12, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Enter at least one year's data to save</span>
        )}
        {response.saved && (
          <span style={{ fontSize: 12, color: '#22c55e', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>✓ Response saved</span>
        )}
      </div>
    </div>
  )
}