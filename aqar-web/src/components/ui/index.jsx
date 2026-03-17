/* ── Toast ── */
import { useEffect } from 'react'

export function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  const colors = {
    success: { bg: '#052e16', border: '#16a34a', icon: '✓' },
    error:   { bg: '#450a0a', border: '#dc2626', icon: '✕' },
    info:    { bg: '#0c1a2e', border: '#3b82f6', icon: 'ℹ' },
  }
  const c = colors[type] || colors.info
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      background:c.bg, border:`1px solid ${c.border}`, color:'#f1f5f9',
      padding:'13px 20px', borderRadius:10, fontSize:14, fontWeight:500,
      display:'flex', alignItems:'center', gap:10,
      boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
      animation:'slideUp .3s ease',
      fontFamily:"'Plus Jakarta Sans', sans-serif",
    }}>
      <span style={{ color:c.border, fontWeight:700 }}>{c.icon}</span>
      {msg}
    </div>
  )
}

/* ── Badge ── */
export function Badge({ type }) {
  const isQlM = type === 'QlM'
  return (
    <span style={{
      fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
      background: isQlM ? '#1e1b4b' : '#0c1a3a',
      color: isQlM ? '#a5b4fc' : '#7dd3fc',
      letterSpacing:1, textTransform:'uppercase', fontFamily:'monospace',
      border: `1px solid ${isQlM ? '#4338ca' : '#1d4ed8'}`,
    }}>
      {type}
    </span>
  )
}

/* ── Progress Ring ── */
export function ProgressRing({ pct, size=64, stroke=6, color }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition:'stroke-dashoffset .7s ease' }} />
    </svg>
  )
}

/* ── Progress Bar ── */
export function ProgressBar({ pct, color, height=6 }) {
  return (
    <div style={{ height, background:'#0f172a', borderRadius:4, overflow:'hidden' }}>
      <div style={{
        height:'100%', borderRadius:4,
        width:`${pct}%`, background:color,
        transition:'width .6s ease',
      }} />
    </div>
  )
}

/* ── Card ── */
export function Card({ children, style }) {
  return (
    <div style={{
      background:'#0d1b2e', border:'1px solid #1e293b',
      borderRadius:14, ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Button ── */
export function Button({ children, onClick, variant='primary', disabled, small, style }) {
  const base = {
    padding: small ? '7px 16px' : '11px 24px',
    borderRadius:8, border:'none', cursor:disabled?'not-allowed':'pointer',
    fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:600,
    fontSize: small ? 12 : 14, transition:'all .2s', ...style,
  }
  const variants = {
    primary: { background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', opacity:disabled?.5:1 },
    secondary: { background:'#1e293b', color:disabled?'#475569':'#94a3b8' },
    danger: { background:'#7f1d1d', color:'#fca5a5' },
    success: { background:'#052e16', color:'#86efac' },
  }
  return (
    <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

/* ── Spinner ── */
export function Spinner({ size=32 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      border:`3px solid #1e293b`,
      borderTopColor:'#6366f1',
      animation:'spin .8s linear infinite',
    }} />
  )
}
