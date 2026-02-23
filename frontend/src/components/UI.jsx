import React from 'react';

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ icon, value, label, change, changeType = 'up', accent = '#6fcf97' }) {
  return (
    <div className="fade-up" style={{
      background:'var(--card)', border:'1px solid var(--border)', borderRadius:14,
      padding:20, position:'relative', overflow:'hidden', transition:'all 0.25s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='rgba(111,207,151,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--border)'; }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${accent},transparent)`, borderRadius:'14px 14px 0 0' }} />
      <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'var(--cream)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>{label}</div>
      {change && (
        <div style={{ fontSize:11, marginTop:8, fontWeight:600, fontFamily:"'Space Mono',monospace", color: changeType==='up' ? 'var(--green)' : 'var(--terra)' }}>
          {changeType==='up' ? '▲' : '▼'} {change}
        </div>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, title, action, style = {} }) {
  return (
    <div className="fade-up" style={{
      background:'var(--card)', border:'1px solid var(--border)', borderRadius:14,
      padding:20, ...style
    }}>
      {(title || action) && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          {title && <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'var(--cream)' }}>{title}</div>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────
export function Btn({ children, variant='primary', onClick, type='button', style={}, disabled=false }) {
  const base = { padding:'9px 18px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', transition:'all 0.2s', cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.6:1, ...style };
  const variants = {
    primary: { background:'linear-gradient(135deg,#4caf7a,#2d7a4f)', color:'#fff' },
    outline: { background:'transparent', color:'var(--wheat)', border:'1px solid rgba(242,201,76,0.3)' },
    danger:  { background:'rgba(235,87,87,0.15)', color:'var(--terra)', border:'1px solid rgba(235,87,87,0.3)' },
    ghost:   { background:'rgba(111,207,151,0.08)', color:'var(--green)', border:'1px solid var(--border)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
    >{children}</button>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, type='text', value, onChange, placeholder, name, required, options, style={} }) {
  const inputStyle = {
    width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'var(--cream)',
    fontSize:13, transition:'border-color 0.2s', ...style,
  };
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', fontSize:11, letterSpacing:1, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, fontFamily:"'Space Mono',monospace" }}>{label}</label>}
      {type === 'select' ? (
        <select value={value} onChange={onChange} name={name} style={{ ...inputStyle, appearance:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.4)'}
          onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
        >
          {options?.map(o => <option key={o.value ?? o} value={o.value ?? o} style={{ background:'#1a2e1e' }}>{o.label ?? o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} name={name} rows={3}
          style={{ ...inputStyle, resize:'vertical' }}
          onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.4)'}
          onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
        />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} name={name} required={required}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.4)'}
          onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
        />
      )}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ label, color = 'green' }) {
  const colors = {
    green:  { bg:'rgba(111,207,151,0.15)', text:'#6fcf97' },
    yellow: { bg:'rgba(242,201,76,0.15)',  text:'#f2c94c' },
    red:    { bg:'rgba(235,87,87,0.15)',   text:'#eb5757' },
    blue:   { bg:'rgba(86,204,242,0.15)',  text:'#56ccf2' },
    gray:   { bg:'rgba(232,245,228,0.08)', text:'rgba(232,245,228,0.4)' },
  };
  const c = colors[color] || colors.green;
  return (
    <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.text }}>
      {label}
    </span>
  );
}

// ── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ value, color = 'var(--green)', label }) {
  return (
    <div>
      {label !== undefined && (
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--muted)', marginBottom:4 }}>
          <span>{label}</span><span style={{ fontFamily:"'Space Mono',monospace", color:'var(--wheat)' }}>{value}%</span>
        </div>
      )}
      <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${value}%`, background:color, borderRadius:3, transition:'width 0.8s ease' }} />
      </div>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────
export function Table({ columns, data, emptyMsg = 'No data found' }) {
  const th = { fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', padding:'8px 14px', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.07)', fontFamily:"'Space Mono',monospace", whiteSpace:'nowrap' };
  const td = { padding:'12px 14px', fontSize:13, color:'var(--cream)', borderBottom:'1px solid rgba(255,255,255,0.04)' };
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr>{columns.map((c,i) => <th key={i} style={th}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} style={{ ...td, textAlign:'center', color:'var(--muted)', padding:'24px' }}>{emptyMsg}</td></tr>
            : data.map((row, ri) => (
              <tr key={ri}
                onMouseEnter={e => e.currentTarget.querySelectorAll('td').forEach(td => td.style.background='rgba(111,207,151,0.04)')}
                onMouseLeave={e => e.currentTarget.querySelectorAll('td').forEach(td => td.style.background='transparent')}
              >
                {columns.map((col, ci) => (
                  <td key={ci} style={td}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, action }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
      <div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:'var(--cream)' }}>{icon} {title}</h1>
        {subtitle && <p style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:3, background:'rgba(0,0,0,0.2)', padding:4, borderRadius:10, marginBottom:20, flexWrap:'wrap' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          flex:1, minWidth:100, padding:'8px 12px', borderRadius:7, border:'none', fontSize:12, fontWeight:600,
          background: active===t.key ? 'rgba(111,207,151,0.2)' : 'transparent',
          color:      active===t.key ? 'var(--green)'           : 'var(--muted)',
          cursor:'pointer', transition:'all 0.18s',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="fade-up" style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700 }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:20, cursor:'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────
export function AlertItem({ icon, title, message, type = 'info', time }) {
  const colors = {
    warning: { bg:'rgba(242,201,76,0.08)', border:'rgba(242,201,76,0.2)' },
    danger:  { bg:'rgba(235,87,87,0.08)',  border:'rgba(235,87,87,0.2)' },
    success: { bg:'rgba(111,207,151,0.08)',border:'rgba(111,207,151,0.2)' },
    info:    { bg:'rgba(86,204,242,0.08)', border:'rgba(86,204,242,0.2)' },
  };
  const c = colors[type];
  return (
    <div style={{ display:'flex', gap:12, padding:12, borderRadius:10, marginBottom:8, background:c.bg, border:`1px solid ${c.border}`, alignItems:'flex-start' }}>
      <div style={{ fontSize:20, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)' }}>{title}</div>
        <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{message}</div>
      </div>
      {time && <div style={{ fontSize:10, color:'var(--muted)', fontFamily:"'Space Mono',monospace", flexShrink:0 }}>{time}</div>}
    </div>
  );
}
