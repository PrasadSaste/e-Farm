import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { STATES, CROP_TYPES } from '../utils/helpers';
import toast from 'react-hot-toast';

const initialForm = { name:'', phone:'', email:'', password:'', role:'farmer', 'location.state':'Maharashtra', 'location.district':'', landSize:'', primaryCrop:'Wheat' };

export default function RegisterPage() {
  const [form, setForm]     = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate      = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name:     form.name,
        phone:    form.phone,
        email:    form.email,
        password: form.password,
        role:     form.role,
        location: { state: form['location.state'], district: form['location.district'] },
        landSize:    +form.landSize || undefined,
        primaryCrop: form.primaryCrop,
      };
      await register(payload);
      toast.success('Account created! Welcome to E-FARM 🌱');
      navigate('/');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 70% 50%, #1a2e1e 0%, #0f1a12 60%)', padding:'24px 20px' }}>
      <div className="fade-up" style={{ width:'100%', maxWidth:520 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:44 }}>🌱</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'#f2c94c', marginTop:6 }}>Join E-FARM</h1>
        </div>

        <div style={{ background:'rgba(30,51,36,0.85)', border:'1px solid rgba(111,207,151,0.15)', borderRadius:18, padding:28, backdropFilter:'blur(10px)' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, marginBottom:20, color:'#e8f5e4' }}>Create Account</h2>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Inp label="Full Name"      name="name"       value={form.name}       onChange={handle} placeholder="Rajesh Patel" required />
              <Inp label="Mobile Number"  name="phone"      value={form.phone}      onChange={handle} placeholder="9876543210"   required type="tel" />
              <Inp label="Email (optional)"name="email"     value={form.email}      onChange={handle} placeholder="you@email.com" type="email" />
              <Inp label="Password"       name="password"   value={form.password}   onChange={handle} placeholder="Min 6 chars"  required type="password" />
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={labelS}>Register As</label>
              <select name="role" value={form.role} onChange={handle} style={inputS}>
                <option value="farmer">🌾 Farmer</option>
                <option value="buyer">🛒 Buyer</option>
              </select>
            </div>

            {form.role === 'farmer' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={labelS}>State</label>
                  <select name="location.state" value={form['location.state']} onChange={handle} style={inputS}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Inp label="District" name="location.district" value={form['location.district']} onChange={handle} placeholder="e.g. Pune" />
                <Inp label="Land Size (acres)" name="landSize" value={form.landSize} onChange={handle} placeholder="e.g. 10" type="number" />
                <div>
                  <label style={labelS}>Primary Crop</label>
                  <select name="primaryCrop" value={form.primaryCrop} onChange={handle} style={inputS}>
                    {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', marginTop:8, background:'linear-gradient(135deg,#4caf7a,#2d7a4f)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? 'Creating Account...' : 'Register 🌱'}
            </button>
          </form>
          <div style={{ marginTop:14, textAlign:'center', fontSize:13, color:'rgba(232,245,228,0.5)' }}>
            Already have an account? <Link to="/login" style={{ color:'#f2c94c', fontWeight:600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelS = { display:'block', fontSize:11, letterSpacing:1, textTransform:'uppercase', color:'rgba(232,245,228,0.4)', marginBottom:6, fontFamily:"'Space Mono',monospace" };
const inputS  = { width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#e8f5e4', fontSize:13, outline:'none' };

function Inp({ label, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={labelS}>{label}</label>
      <input style={inputS} {...props}
        onFocus={e => e.target.style.borderColor='rgba(111,207,151,0.5)'}
        onBlur={e  => e.target.style.borderColor='rgba(255,255,255,0.1)'}
      />
    </div>
  );
}
