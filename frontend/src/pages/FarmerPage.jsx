// ============================================================
//  pages/FarmerPage.jsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { farmerAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Card, Btn, Input, PageHeader, Badge } from '../components/UI';
import { STATES, CROP_TYPES, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const FarmerPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});

  useEffect(() => {
    farmerAPI.getOne(user?._id || user?.id).then(r => {
      setProfile(r.data);
      setForm({
        name:               r.data.name         || '',
        email:              r.data.email         || '',
        'location.state':   r.data.location?.state    || '',
        'location.district':r.data.location?.district || '',
        'location.village': r.data.location?.village  || '',
        landSize:           r.data.landSize      || '',
        waterSource:        r.data.waterSource   || '',
        primaryCrop:        r.data.primaryCrop   || '',
        'bankDetails.accountNo': r.data.bankDetails?.accountNo || '',
        'bankDetails.ifsc':      r.data.bankDetails?.ifsc      || '',
        'bankDetails.bankName':  r.data.bankDetails?.bankName  || '',
      });
    });
  }, [user]);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    try {
      const payload = {
        name:  form.name,
        email: form.email,
        location: { state: form['location.state'], district: form['location.district'], village: form['location.village'] },
        landSize:    +form.landSize || undefined,
        waterSource: form.waterSource,
        primaryCrop: form.primaryCrop,
        bankDetails: { accountNo: form['bankDetails.accountNo'], ifsc: form['bankDetails.ifsc'], bankName: form['bankDetails.bankName'] },
      };
      const r = await farmerAPI.update(user?._id || user?.id, payload);
      setProfile(r.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err?.message || 'Update failed'); }
  };

  if (!profile) return <div style={{ color:'var(--muted)', padding:20 }}>Loading profile...</div>;

  return (
    <div>
      <PageHeader icon="👨‍🌾" title="Farmer Profile" subtitle="Manage your farm information and documents"
        action={<Btn onClick={() => setEditing(!editing)} variant={editing ? 'outline' : 'primary'}>{editing ? 'Cancel' : 'Edit Profile'}</Btn>} />

      {!editing ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <Card>
              <div style={{ textAlign:'center', paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--green),#2d7a4f)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 12px' }}>👨‍🌾</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900 }}>{profile.name}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>ID: FRM-{profile._id?.slice(-6).toUpperCase()}</div>
                <div style={{ marginTop:8 }}><Badge label={profile.isVerified ? '✓ Verified' : 'Pending'} color={profile.isVerified ? 'green' : 'yellow'} /></div>
              </div>
              {[
                ['📱', 'Phone',    profile.phone],
                ['📧', 'Email',    profile.email || '—'],
                ['⭐', 'Rating',   `${profile.rating}/5`],
                ['🗓', 'Member Since', formatDate(profile.createdAt)],
              ].map(([ic,l,v]) => (
                <div key={l} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span>{ic}</span>
                  <span style={{ fontSize:12, color:'var(--muted)', width:100 }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card title="Bank Details">
              {[
                ['Bank',    profile.bankDetails?.bankName  || '—'],
                ['Account', profile.bankDetails?.accountNo || '—'],
                ['IFSC',    profile.bankDetails?.ifsc      || '—'],
                ['KCC Limit', profile.kccLimit ? `₹${profile.kccLimit.toLocaleString()}` : '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <Card title="Farm Information">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {[
                  ['📍 Location',   `${profile.location?.village ? profile.location.village + ', ' : ''}${profile.location?.district || ''}${profile.location?.state ? ', '+profile.location.state : ''}`],
                  ['🌾 Land Size',  profile.landSize ? `${profile.landSize} acres` : '—'],
                  ['💧 Water',      profile.waterSource || '—'],
                  ['🌱 Primary Crop', profile.primaryCrop || '—'],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:14, border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Crop Calendar">
              {['Jan–Apr: 🌾 Wheat (Growing)', 'Dec–Nov: 🎋 Sugarcane (Growing)', 'Mar–May: 🍅 Tomato (Planned)', 'Jun–Oct: 🌿 Soybean (Planned)'].map((s,i) => (
                <div key={i} style={{ padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>{s}</div>
              ))}
            </Card>
          </div>
        </div>
      ) : (
        <Card title="Edit Profile">
          <form onSubmit={save}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label="Full Name"  name="name"  value={form.name}  onChange={handle} required />
              <Input label="Email"      name="email" value={form.email} onChange={handle} type="email" />
              <Input label="State" type="select" name="location.state" value={form['location.state']} onChange={handle} options={STATES.map(s=>({value:s,label:s}))} />
              <Input label="District"   name="location.district" value={form['location.district']} onChange={handle} />
              <Input label="Village"    name="location.village"  value={form['location.village']}  onChange={handle} />
              <Input label="Land Size (acres)" type="number" name="landSize" value={form.landSize} onChange={handle} />
              <Input label="Water Source" name="waterSource" value={form.waterSource} onChange={handle} placeholder="Drip, Canal, Borewell..." />
              <Input label="Primary Crop" type="select" name="primaryCrop" value={form.primaryCrop} onChange={handle} options={CROP_TYPES.map(c=>({value:c,label:c}))} />
              <Input label="Bank Name"   name="bankDetails.bankName"  value={form['bankDetails.bankName']}  onChange={handle} />
              <Input label="Account No"  name="bankDetails.accountNo" value={form['bankDetails.accountNo']} onChange={handle} />
              <Input label="IFSC Code"   name="bankDetails.ifsc"      value={form['bankDetails.ifsc']}      onChange={handle} />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <Btn type="submit" style={{ flex:1 }}>Save Changes</Btn>
              <Btn variant="outline" onClick={() => setEditing(false)} style={{ flex:1 }}>Cancel</Btn>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default FarmerPage;
