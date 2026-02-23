import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm]     = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.phone, form.password);
      toast.success('Welcome back! 🌱');
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 30% 50%, #1a2e1e 0%, #0f1a12 60%)' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:420, padding:'0 20px' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52 }}>🌱</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'#f2c94c', letterSpacing:2, marginTop:8 }}>E-FARM</h1>
          <p style={{ fontSize:12, color:'rgba(232,245,228,0.4)', letterSpacing:3, textTransform:'uppercase', marginTop:4, fontFamily:"'Space Mono',monospace" }}>Smart Agriculture Platform</p>
        </div>

        <div style={{ background:'rgba(30,51,36,0.8)', border:'1px solid rgba(111,207,151,0.15)', borderRadius:18, padding:28, backdropFilter:'blur(10px)' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:20, color:'#e8f5e4' }}>Sign In</h2>
          <form onSubmit={submit}>
            <div style={{ marginBottom:14 }}>
              <label style={labelS}>Mobile Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handle} placeholder="9876543210" required style={inputS}
                onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.5)'}
                onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={labelS}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required style={inputS}
                onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.5)'}
                onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#4caf7a,#2d7a4f)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
              {loading ? 'Signing in...' : 'Sign In 🌱'}
            </button>
          </form>

          <div style={{ marginTop:16, textAlign:'center', fontSize:13, color:'rgba(232,245,228,0.5)' }}>
            New to E-FARM? <Link to="/register" style={{ color:'#f2c94c', fontWeight:600 }}>Register here</Link>
          </div>

          <div style={{ marginTop:16, padding:12, background:'rgba(111,207,151,0.06)', borderRadius:8, fontSize:11, color:'rgba(232,245,228,0.4)', fontFamily:"'Space Mono',monospace" }}>
            Demo: 9876543210 / password123
          </div>
        </div>
      </div>
    </div>
  );
}

const labelS = { display:'block', fontSize:11, letterSpacing:1, textTransform:'uppercase', color:'rgba(232,245,228,0.4)', marginBottom:6, fontFamily:"'Space Mono',monospace" };
const inputS  = { width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#e8f5e4', fontSize:13, outline:'none', transition:'border-color 0.2s' };
