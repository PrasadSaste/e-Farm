import React, { useEffect, useState } from 'react';
import { schemeAPI } from '../services/api';
import { Card, Btn, Input, PageHeader, Badge, Modal } from '../components/UI';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [apps,    setApps]    = useState([]);
  const [check,   setCheck]   = useState(null);
  const [checkForm, setCheckForm] = useState({ landSize:'', income:'', category:'General' });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([schemeAPI.getAll(), schemeAPI.myApplications()])
      .then(([s, a]) => { setSchemes(s.data || []); setApps(a.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const apply = async id => {
    try { await schemeAPI.apply(id); toast.success('Application submitted! ✅'); schemeAPI.myApplications().then(r => setApps(r.data)); }
    catch (err) { toast.error(err?.message || 'Already applied or error'); }
  };

  const checkEligibility = async e => {
    e.preventDefault();
    try {
      const r = await schemeAPI.checkEligibility(check._id, { landSize:+checkForm.landSize, income:+checkForm.income, category:checkForm.category });
      setResult(r);
    } catch (err) { toast.error(err?.message || 'Error'); }
  };

  const appliedIds = new Set(apps.map(a => a.farmerId));

  return (
    <div>
      <PageHeader icon="📋" title="Government Schemes & Subsidies" subtitle="Explore, check eligibility and apply for schemes" />

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20 }}>
        <div>
          <Card title="Available Schemes">
            {loading ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
              : schemes.map(s => (
                <div key={s._id} style={{ padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700 }}>{s.name}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{s.description}</div>
                    </div>
                    <div style={{ flexShrink:0, marginLeft:12, textAlign:'right' }}>
                      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:'var(--wheat)', fontWeight:700, marginBottom:6 }}>{s.amount}</div>
                      {s.deadline && <div style={{ fontSize:10, color:'var(--muted)', marginBottom:6 }}>⏰ {formatDate(s.deadline)}</div>}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    <Btn onClick={() => { setCheck(s); setResult(null); }} variant="ghost" style={{ padding:'5px 12px', fontSize:11 }}>Check Eligibility</Btn>
                    <Btn onClick={() => apply(s._id)} style={{ padding:'5px 12px', fontSize:11 }}>Apply Now</Btn>
                  </div>
                </div>
              ))
            }
          </Card>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <Card title="My Applications">
            {apps.length === 0
              ? <p style={{ color:'var(--muted)', fontSize:13 }}>No applications yet.</p>
              : apps.map((a, i) => (
                <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.schemeName}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>{formatDate(a.appliedAt)}</span>
                    <Badge label={a.status || 'Pending'} color={a.status==='Approved'?'green':a.status==='Rejected'?'red':'yellow'} />
                  </div>
                </div>
              ))
            }
          </Card>

          {/* Quick Tips */}
          <Card title="💡 Tips for Applying">
            {['Keep Aadhaar and land records ready','Apply before the deadline date','Check eligibility before applying','Track status in My Applications'].map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                <span style={{ color:'var(--green)' }}>✓</span>{t}
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ELIGIBILITY CHECK MODAL */}
      <Modal open={!!check} onClose={() => { setCheck(null); setResult(null); }} title={`Check Eligibility — ${check?.name}`}>
        {check && (
          <form onSubmit={checkEligibility}>
            <Input label="Land Size (acres)" type="number" value={checkForm.landSize} onChange={e => setCheckForm(p=>({...p,landSize:e.target.value}))} placeholder="e.g. 5" required />
            <Input label="Annual Income (₹)" type="number" value={checkForm.income}   onChange={e => setCheckForm(p=>({...p,income:e.target.value}))}   placeholder="e.g. 150000" required />
            <Input label="Category" type="select" value={checkForm.category} onChange={e => setCheckForm(p=>({...p,category:e.target.value}))}
              options={['General','OBC','SC/ST'].map(c=>({value:c,label:c}))} />
            <Btn type="submit" style={{ width:'100%', padding:12, marginTop:4 }}>Check Now</Btn>
            {result && (
              <div style={{ marginTop:16, padding:14, borderRadius:10, background: result.eligible ? 'rgba(111,207,151,0.1)' : 'rgba(235,87,87,0.1)', border:`1px solid ${result.eligible?'rgba(111,207,151,0.3)':'rgba(235,87,87,0.3)'}`, textAlign:'center', fontSize:15, fontWeight:700, color: result.eligible ? 'var(--green)' : 'var(--terra)' }}>
                {result.message}
              </div>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}
