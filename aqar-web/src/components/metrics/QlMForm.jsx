import { useResponses } from '../../context/ResponseContext'
import { countWords } from '../../utils/naacData'
import FileUpload from './FileUpload'
import { ProgressBar, Button } from '../ui'

const MIN_WORDS = 100
const MAX_WORDS = 200

export default function QlMForm({ metric, response, onChange, onSave, color }) {
  const { uploadFile, removeDocument } = useResponses()

  const text  = response.text || ''
  const words = countWords(text)
  const tooShort = words < MIN_WORDS && text.length > 0
  const tooLong  = words > MAX_WORDS
  const empty    = text.length === 0
  const valid    = words >= MIN_WORDS && words <= MAX_WORDS

  const pct      = Math.min((words / MAX_WORDS) * 100, 100)
  const barColor = tooLong ? '#ef4444' : valid ? '#22c55e' : color

  const wordStatus = empty
    ? `0 / ${MAX_WORDS} words`
    : tooShort
    ? `${words} words — need ${MIN_WORDS - words} more`
    : tooLong
    ? `${words} words — ${words - MAX_WORDS} over limit`
    : `${words} / ${MAX_WORDS} words ✓`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => onChange({ ...response, text: e.target.value, saved: false })}
          placeholder={`Describe ${metric.title} in 100–200 words...`}
          style={{
            width: '100%', minHeight: 180, background: '#060d18',
            border: `1.5px solid ${tooLong ? '#ef4444' : valid ? '#16a34a' : empty ? '#1e293b' : color + '60'}`,
            borderRadius: 10, color: '#e2e8f0',
            padding: '14px 16px 36px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
            lineHeight: 1.75, resize: 'vertical', outline: 'none',
            boxSizing: 'border-box', transition: 'border-color .2s',
          }}
          onFocus={e => !valid && (e.target.style.borderColor = color)}
          onBlur={e => e.target.style.borderColor = tooLong ? '#ef4444' : valid ? '#16a34a' : empty ? '#1e293b' : color + '60'}
        />
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontSize: 11, fontFamily: 'monospace',
          color: tooLong ? '#ef4444' : valid ? '#22c55e' : '#475569',
        }}>{wordStatus}</div>
      </div>

      {/* Word meter */}
      <div>
        <ProgressBar pct={pct} color={barColor} height={5} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>0</span>
          <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>100 min</span>
          <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>200 max</span>
        </div>
      </div>

      {tooShort && (
        <div style={{ background: '#1a0e00', border: '1px solid #92400e', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fbbf24', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ⚠ Need at least {MIN_WORDS - words} more word{MIN_WORDS - words !== 1 ? 's' : ''} to meet the minimum requirement.
        </div>
      )}
      {tooLong && (
        <div style={{ background: '#1a0000', border: '1px solid #991b1b', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fca5a5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ✕ Text exceeds the 200-word maximum by {words - MAX_WORDS} word{words - MAX_WORDS !== 1 ? 's' : ''}. Please trim.
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
          onClick={() => valid && onSave()}
          disabled={!valid}
          variant={valid ? 'primary' : 'secondary'}
          style={valid ? { background: `linear-gradient(135deg,${color},${color}cc)` } : {}}
        >
          {response.saved ? '✓ Saved' : 'Save Response'}
        </Button>
        {valid && !response.saved && (
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Unsaved changes</span>
        )}
        {response.saved && (
          <span style={{ fontSize: 12, color: '#22c55e', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>✓ Response saved</span>
        )}
      </div>
    </div>
  )
}