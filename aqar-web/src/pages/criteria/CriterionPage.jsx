import { getCriterionByKey, getCriterionCompletion, isMetricComplete } from '../../utils/naacData'
import { useResponses } from '../../context/ResponseContext'
import MetricCard from '../../components/metrics/MetricCard'
import { ProgressBar, Card } from '../../components/ui'

export default function CriterionPage({ criterionKey, onToast, readOnly = false }) {
  const { responses, updateResponse, saveResponse } = useResponses()
  const criterion = getCriterionByKey(criterionKey)

  if (!criterion) return (
    <div style={{ color: '#64748b', textAlign: 'center', padding: 60, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Criterion not found.
    </div>
  )

  const { done, total, pct } = getCriterionCompletion(criterion, responses)
  const { color, icon, label, subtitle, metrics } = criterion
  const totalRows = metrics.reduce((s, m) => s + (responses[m.id]?.rows?.length || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {readOnly && (
        <div style={{
          background: '#0c1a2e', border: '1px solid #1e3a5f',
          borderRadius: 10, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>🔒</span>
          <span style={{ fontSize: 13, color: '#7dd3fc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            This data has been submitted to admin and is <strong>read-only</strong>. Contact your admin to unlock for editing.
          </span>
        </div>
      )}

      <div style={{
        background: 'linear-gradient(135deg, #060d18 0%, #0a1520 100%)',
        border: `1px solid ${color}40`, borderRadius: 16,
        padding: '22px 26px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: `${color}20`, border: `1.5px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>{icon}</div>
          <div>
            <h2 style={{ margin: '0 0 3px', fontSize: 20, color: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
              {label}
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {subtitle}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 28, color, fontWeight: 800 }}>{pct}%</div>
          <div style={{ fontSize: 12, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {done} of {total} metrics filled
          </div>
        </div>
      </div>

      <ProgressBar pct={pct} color={color} height={8} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
        {[
          { label: 'Total Metrics',  value: total,        color: '#64748b' },
          { label: 'Metrics Filled', value: done,         color },
          { label: 'Total Rows',     value: totalRows,    color: '#38bdf8' },
          { label: 'Remaining',      value: total - done, color: total - done > 0 ? '#f97316' : '#22c55e' },
        ].map(({ label: l, value, color: c }) => (
          <Card key={l} style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 18, color: c, fontWeight: 700 }}>{value}</span>
          </Card>
        ))}
      </div>

      {/* Unfilled metrics hint */}
      {done < total && !readOnly && (
        <div style={{
          background: '#0a1520', border: '1px solid #1e3a5f',
          borderRadius: 10, padding: '12px 18px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📋</span>
          <div>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>
              Metrics with no records yet
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {metrics.filter(m => !isMetricComplete(m, responses[m.id])).map(m => (
                <span key={m.id} style={{
                  fontFamily: 'monospace', fontSize: 11,
                  background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 4, padding: '2px 8px', color: '#64748b',
                }}>{m.id}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metrics.map(metric => (
          <MetricCard
            key={metric.id}
            metric={metric}
            response={responses[metric.id] || { rows: [], documents: [], saved: false }}
            color={color}
            readOnly={readOnly}
            onChange={readOnly ? undefined : (val) => updateResponse(metric.id, val)}
            onSave={readOnly ? undefined : async () => {
              const result = await saveResponse(metric.id)
              if (result?.success) onToast(`Metric ${metric.id} saved ✓`, 'success')
              else onToast(`Failed to save ${metric.id}: ${JSON.stringify(result?.error)}`, 'error')
            }}
          />
        ))}
      </div>
    </div>
  )
}
