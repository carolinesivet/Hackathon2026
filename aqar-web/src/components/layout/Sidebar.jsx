import { CRITERIA, getCriterionCompletion } from '../../utils/naacData'
import { useResponses } from '../../context/ResponseContext'
import { useAuth } from '../../context/AuthContext'
import { ProgressRing } from '../ui'

export default function Sidebar({ activeSection, onNavigate, collapsed, onToggle }) {
  const { responses, collegeName } = useResponses()
  const { user, logout } = useAuth()

  const navItems = [
    { key: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { key: '_sep1', sep: true },
    ...CRITERIA.map(c => ({
      key: c.key, icon: c.icon, label: c.label,
      subtitle: c.subtitle, color: c.color,
      completion: getCriterionCompletion(c, responses),
    })),
    { key: '_sep2', sep: true },
    { key: 'reports', icon: '📊', label: 'Reports' },
    { key: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  const W = collapsed ? 64 : 248

  return (
    <aside style={{
      width: W, minWidth: W, maxWidth: W,
      background: '#07111e',
      borderRight: '1px solid #162032',
      display: 'flex', flexDirection: 'column',
      transition: 'width .25s ease',
      overflow: 'hidden', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 14px', borderBottom: '1px solid #162032',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 64,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 14px #4f46e530',
          cursor: 'pointer',
        }} onClick={onToggle}>🎓</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', letterSpacing: 1, textTransform: 'uppercase' }}>NAAC AQAR</div>
            <div style={{ fontSize: 11, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{collegeName}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item, i) => {
          if (item.sep) return <div key={i} style={{ height: 1, background: '#0f2035', margin: '6px 4px' }} />

          const active = activeSection === item.key
          const pct = item.completion?.pct

          return (
            <div key={item.key}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                background: active ? '#0f2240' : 'transparent',
                borderLeft: `3px solid ${active ? (item.color || '#6366f1') : 'transparent'}`,
                marginBottom: 2, transition: 'all .15s',
                overflow: 'hidden', position: 'relative',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = '#0a1929')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: 13, color: active ? '#e2e8f0' : '#64748b',
                      fontWeight: active ? 600 : 400,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      whiteSpace: 'nowrap',
                    }}>{item.label}</div>
                    {item.subtitle && (
                      <div style={{ fontSize: 10, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle}</div>
                    )}
                  </div>
                  {pct !== undefined && (
                    <span style={{
                      fontFamily: 'monospace', fontSize: 10, flexShrink: 0,
                      color: pct === 100 ? '#22c55e' : pct > 0 ? (item.color || '#6366f1') : '#334155',
                      fontWeight: 700,
                    }}>{pct}%</span>
                  )}
                </>
              )}
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '12px', borderTop: '1px solid #162032',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#1e3a5f,#1e4080)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#7dd3fc', fontWeight: 700,
          cursor: 'pointer',
        }} title="Logout" onClick={logout}>
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
            <div style={{ fontSize: 10, color: '#334155' }}>IQAC Portal</div>
          </div>
        )}
      </div>
    </aside>
  )
}
