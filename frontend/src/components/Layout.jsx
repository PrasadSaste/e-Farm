import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV = [
  { to: '/',          icon: '🏡', label: 'Dashboard'  },
  { to: '/farmer',    icon: '👨‍🌾', label: 'Farmer'     },
  { to: '/crops',     icon: '🌾', label: 'Crops'      },
  { to: '/market',    icon: '🛒', label: 'Market'     },
  { to: '/weather',   icon: '🌤', label: 'Weather'    },
  { to: '/schemes',   icon: '📋', label: 'Schemes'    },
  { to: '/analytics', icon: '📊', label: 'Analytics'  },
];

const s = {
  app:     { display:'flex', minHeight:'100vh', background:'var(--soil)' },
  sidebar: { width:240, minHeight:'100vh', background:'var(--bark)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 },
  logo:    { padding:'24px 20px 18px', borderBottom:'1px solid var(--border)' },
  logoIcon:{ fontSize:36 },
  logoTitle:{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'var(--wheat)', letterSpacing:2 },
  logoSub: { fontSize:10, color:'rgba(242,201,76,0.5)', letterSpacing:3, textTransform:'uppercase', marginTop:2, fontFamily:"'Space Mono',monospace" },
  nav:     { flex:1, padding:'14px 10px', overflowY:'auto' },
  navLabel:{ fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'var(--muted)', padding:'8px 12px 4px', fontFamily:"'Space Mono',monospace" },
  footer:  { padding:'14px 18px', borderTop:'1px solid var(--border)' },
  avatar:  { width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--green),#2d7a4f)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 },
  main:    { marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' },
  topbar:  { background:'rgba(15,26,18,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 },
  content: { padding:'28px', flex:1 },
};

const navItemStyle = (isActive) => ({
  display:'flex', alignItems:'center', gap:10, padding:'9px 13px',
  borderRadius:9, cursor:'pointer', marginBottom:2, fontSize:14, fontWeight:500,
  border:'1px solid transparent', textDecoration:'none',
  background: isActive ? 'rgba(111,207,151,0.12)' : 'transparent',
  color:       isActive ? 'var(--wheat)'           : 'rgba(232,245,228,0.6)',
  borderColor: isActive ? 'rgba(111,207,151,0.25)' : 'transparent',
  transition:'all 0.18s',
});

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.app}>
      {/* SIDEBAR */}
      <nav style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>🌱</div>
          <div style={s.logoTitle}>E-FARM</div>
          <div style={s.logoSub}>Smart Agriculture</div>
        </div>

        <div style={s.nav}>
          <div style={s.navLabel}>Modules</div>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to==='/'} style={({ isActive }) => navItemStyle(isActive)}>
              <span style={{ fontSize:18, width:22, textAlign:'center' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <>
              <div style={{ ...s.navLabel, marginTop:10 }}>Admin</div>
              <NavLink to="/admin" style={({ isActive }) => navItemStyle(isActive)}>
                <span style={{ fontSize:18, width:22, textAlign:'center' }}>⚙️</span>Admin Panel
              </NavLink>
            </>
          )}
        </div>

        <div style={s.footer}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={s.avatar}>👨‍🌾</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--cream)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize:11, color:'var(--muted)', textTransform:'capitalize' }}>{user?.role}</div>
            </div>
            <button onClick={handleLogout} title="Logout"
              style={{ background:'none', border:'none', color:'var(--muted)', fontSize:16, cursor:'pointer', padding:'4px' }}>
              ↩
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={s.main}>
        <header style={s.topbar}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700 }}>
            🌱 E-FARM Platform
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ fontSize:12, color:'var(--muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>
        </header>
        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
