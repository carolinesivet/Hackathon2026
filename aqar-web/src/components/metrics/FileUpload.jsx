import { useRef, useState } from 'react'

const MAX_MB = 10
const ALLOWED_EXT = ['pdf', 'docx', 'xlsx']

const extColors = { pdf: '#ef4444', docx: '#3b82f6', xlsx: '#22c55e' }
const extIcons  = { pdf: '📄', docx: '📝', xlsx: '📊' }

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ documents = [], onUpload, onRemove, accentColor }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleFiles = async (files) => {
    setUploadError(null)
    const fileList = Array.from(files)

    for (const f of fileList) {
      const ext = f.name.split('.').pop().toLowerCase()
      if (!ALLOWED_EXT.includes(ext)) {
        setUploadError(`${f.name}: unsupported format (use PDF, DOCX, XLSX)`)
        continue
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setUploadError(`${f.name}: exceeds 10MB limit`)
        continue
      }
      setUploading(true)
      const result = await onUpload(f)
      setUploading(false)
      if (!result?.success) {
        setUploadError(result?.error?.file?.[0] || result?.error || 'Upload failed')
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.style.borderColor = '#1e293b'
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = accentColor }}
        onDragLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
        style={{
          border: '1.5px dashed #1e293b', borderRadius: 10,
          padding: '16px 20px', cursor: uploading ? 'wait' : 'pointer',
          textAlign: 'center', transition: 'all .2s',
          background: '#060d18',
          opacity: uploading ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.background = '#0a1520' }}}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.background = '#060d18' }}
      >
        <input
          ref={inputRef} type="file" multiple
          accept=".pdf,.docx,.xlsx" style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <div style={{ fontSize: 22, marginBottom: 6 }}>{uploading ? '⏳' : '📎'}</div>
        <div style={{ fontSize: 13, color: '#64748b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {uploading
            ? 'Uploading…'
            : <>Drop files here or <span style={{ color: accentColor }}>browse</span></>
          }
        </div>
        <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>PDF · DOCX · XLSX · Max 10MB each</div>
      </div>

      {uploadError && (
        <div style={{
          background: '#1a0000', border: '1px solid #7f1d1d',
          borderRadius: 8, padding: '8px 14px',
          fontSize: 12, color: '#fca5a5',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          ✕ {uploadError}
        </div>
      )}

      {documents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {documents.map(doc => (
            <div key={doc.id} style={{
              background: '#0a1929', border: '1px solid #1e293b',
              borderRadius: 8, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>{extIcons[doc.ext] || '📁'}</span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: 12, color: '#cbd5e1', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  {doc.url
                    ? <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>{doc.name}</a>
                    : doc.name
                  }
                </div>
                <div style={{ fontSize: 10, color: '#334155' }}>
                  <span style={{ color: extColors[doc.ext] || '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{doc.ext}</span>
                  {doc.size ? ` · ${formatSize(doc.size)}` : ''}
                  {doc.fromServer && <span style={{ color: '#22c55e', marginLeft: 6 }}>✓ saved</span>}
                </div>
              </div>
              <button
                onClick={() => onRemove(doc.id, doc.fromServer)}
                style={{
                  background: 'none', border: 'none',
                  color: '#475569', cursor: 'pointer',
                  fontSize: 16, padding: '0 2px',
                  lineHeight: 1, transition: 'color .15s', flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}