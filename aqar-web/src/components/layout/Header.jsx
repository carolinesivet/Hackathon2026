import { CRITERIA } from '../../utils/naacData'

export default function Header({ activeSection, onToggleSidebar }) {
  const criterion = CRITERIA.find(c => c.key === activeSection)

  const sectionLabels = {
    dashboard: 'Dashboard',
    reports: 'AQAR Reports',
    settings: 'Settings',
  }

  const title = criterion ? criterion.label : (sectionLabels[activeSection] || activeSection)
  const subtitle = criterion?.subtitle

  return (
    <header style={{
      height: 56, background: '#07111e',
      borderBottom: '1px solid #162032',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, flexShrink: 0,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none', border: 'none', color: '#475569',
          cursor: 'pointer', fontSize: 18, padding: '4px 6px',
          borderRadius: 6, lineHeight: 1,
          transition: 'color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
      >☰</button>

      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {criterion?.icon && <span style={{ marginRight: 8 }}>{criterion.icon}</span>}
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: 12, color: '#475569', marginLeft: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            · {subtitle}
          </span>
        )}
      </div>

      <div style={{
        background: '#0d1b2e', border: '1px solid #1e3a5f',
        borderRadius: 20, padding: '4px 14px',
        fontSize: 11, color: '#7dd3fc', fontFamily: 'monospace',
        letterSpacing: 1,
      }}>
        IQAC PORTAL
      </div>
    </header>
  )
}
