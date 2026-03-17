// src/pages/admin/AdminSidebar.jsx
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { key: 'overview',    icon: '⊞',  label: 'Overview' },
  { key: '_sep1', sep: true },
  { key: 'departments', icon: '🏛️', label: 'Departments' },
  { key: 'hods',        icon: '👤', label: 'HOD Accounts' },
  { key: '_sep2', sep: true },
  { key: 'settings',   icon: '⚙️', label: 'Settings' },
]

export default function AdminSidebar({ activeSection, onNavigate, activeDept }) {
  const { user, logout } = useAuth()

  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: '#07111e',
      borderRight: '1px solid #162032',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 16px', borderBottom: '1px solid #162032',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#92400e,#d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>🎓</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', letterSpacing: 1, textTransform: 'uppercase' }}>
            NAAC AQAR
          </div>
          <div style={{ fontSize: 10, color: '#78350f' }}>Admin Panel</div>
        </div>
      </div>

      {/* Active dept indicator */}
      {activeDept && activeSection === 'dept-data' && (
        <div style={{
          margin: '10px 10px 0',
          background: '#0a1929', border: '1px solid #1e3a5f',
          borderRadius: 8, padding: '8px 12px',
        }}>
          <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Viewing</div>
          <div style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {activeDept.name}
          </div>
          <div style={{ fontSize: 10, color: '#334155' }}>
            {activeDept.stream === 'aided' ? 'Aided' : 'Self Finance'}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {navItems.map((item, i) => {
          if (item.sep) return <div key={i} style={{ height: 1, background: '#0f2035', margin: '6px 4px' }} />
          const active = activeSection === item.key
          return (
            <div
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                background: active ? '#1a0e00' : 'transparent',
                borderLeft: `3px solid ${active ? '#d97706' : 'transparent'}`,
                marginBottom: 2, transition: 'all .15s',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = '#0a1929')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              <span style={{
                fontSize: 13, color: active ? '#fbbf24' : '#64748b',
                fontWeight: active ? 600 : 400,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{item.label}</span>
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
          background: 'linear-gradient(135deg,#92400e,#d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#fff', fontWeight: 700, cursor: 'pointer',
        }} onClick={logout} title="Logout">
          {user?.username?.[0]?.toUpperCase() || 'A'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.username}
          </div>
          <div style={{ fontSize: 10, color: '#d97706' }}>AQAR Cell Head</div>
        </div>
      </div>
    </aside>
  )
}
