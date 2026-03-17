import { CRITERIA, getOverallCompletion, getCriterionCompletion } from '../utils/naacData'
import { useResponses } from '../context/ResponseContext'
import { ProgressRing, ProgressBar, Card } from '../components/ui'

export default function Dashboard({ onNavigate }) {
  const { responses, getTotalDocs, collegeName, aqarYear } = useResponses()
  const { done, total, pct } = getOverallCompletion(responses)
  const docs = getTotalDocs()

  const readinessColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#fbbf24' : '#818cf8'
  const readinessLabel = pct < 20 ? 'Getting Started'
    : pct < 50 ? 'In Progress'
    : pct < 80 ? 'Good Progress'
    : pct < 100 ? 'Almost Ready'
    : '🎉 Complete!'

  const statCards = [
    { label: 'Total Metrics', value: total, icon: '📊', color: '#818cf8' },
    { label: 'Completed', value: done, icon: '✅', color: '#22c55e' },
    { label: 'Pending', value: total - done, icon: '⏳', color: '#fbbf24' },
    { label: 'Documents', value: docs, icon: '📁', color: '#38bdf8' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero readiness card */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #060d18 100%)',
        border: '1px solid #1e3a5f', borderRadius: 16,
        padding: '28px 32px',
        display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ProgressRing pct={pct} size={110} stroke={9} color={readinessColor} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{pct}%</span>
            <span style={{ fontSize: 9, color: '#475569', letterSpacing: 1, textTransform: 'uppercase' }}>ready</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10, color: '#4f46e5', letterSpacing: 2,
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 6,
            fontFamily: 'monospace',
          }}>AQAR Readiness Score</div>
          <h2 style={{
            margin: '0 0 6px', fontSize: 26, color: '#f1f5f9',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
          }}>{readinessLabel}</h2>
          <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
            {pct < 30
              ? 'Start filling in criterion-wise data to build your AQAR report. Click any criterion in the sidebar to begin.'
              : pct < 70
              ? 'Good momentum! Continue entering data and uploading supporting documents for each metric.'
              : pct < 100
              ? 'Almost there! A few more metrics to complete before your AQAR is ready.'
              : 'All metrics complete! Head to Reports to generate your AQAR document.'
            }
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('criterion-1')} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff',
              fontWeight: 600, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Continue Entering Data →</button>
            <button onClick={() => onNavigate('reports')} style={{
              padding: '8px 18px', borderRadius: 8,
              border: '1px solid #1e3a5f', cursor: 'pointer',
              background: 'transparent', color: '#94a3b8',
              fontWeight: 600, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>View Reports</button>
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#334155', marginBottom: 4 }}>Institution</div>
          <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>{collegeName}</div>
          <div style={{ fontSize: 11, color: '#334155', marginTop: 6, marginBottom: 4 }}>AQAR Year</div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#818cf8' }}>{aqarYear}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14 }}>
        {statCards.map(({ label, value, icon, color }) => (
          <Card key={label} style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'monospace', color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Criterion breakdown */}
      <Card style={{ padding: 24 }}>
        <div style={{
          fontSize: 10, color: '#475569', letterSpacing: 2,
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 20,
          fontFamily: 'monospace',
        }}>CRITERION PROGRESS</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CRITERIA.map(criterion => {
            const { done, total, pct } = getCriterionCompletion(criterion, responses)
            return (
              <div key={criterion.key}
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate(criterion.key)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{criterion.icon}</span>
                    <div>
                      <span style={{
                        fontSize: 13, color: '#cbd5e1',
                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                      }}>{criterion.label}</span>
                      <span style={{ fontSize: 11, color: '#334155', marginLeft: 8 }}>· {criterion.subtitle}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: 12,
                      color: pct === 100 ? '#22c55e' : criterion.color,
                      fontWeight: 700,
                    }}>{done}/{total}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#334155', marginLeft: 6 }}>({pct}%)</span>
                  </div>
                </div>
                <ProgressBar pct={pct} color={criterion.color} />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Quick actions */}
      <Card style={{ padding: 24 }}>
        <div style={{
          fontSize: 10, color: '#475569', letterSpacing: 2,
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 16,
          fontFamily: 'monospace',
        }}>QUICK ACTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {[
            { label: 'Generate AQAR Report', icon: '📄', action: 'reports', color: '#4f46e5' },
            { label: 'View Part A Info', icon: '📋', action: 'part-a', color: '#818cf8' },
            { label: 'Research Metrics', icon: '🔬', action: 'criterion-3', color: '#34d399' },
            { label: 'Manage Settings', icon: '⚙️', action: 'settings', color: '#64748b' },
          ].map(({ label, icon, action, color }) => (
            <button key={label} onClick={() => onNavigate(action)} style={{
              padding: '14px 18px', borderRadius: 10,
              background: '#0a1929', border: `1px solid ${color}30`,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = '#0d2040' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = color + '30'; e.currentTarget.style.background = '#0a1929' }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
