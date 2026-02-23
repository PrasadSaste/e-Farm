import React, { useEffect, useState } from 'react';
import { farmerAPI, adminAPI } from '../services/api';
import { Card, Btn, Badge, Table, Tabs, PageHeader, StatCard } from '../components/UI';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [tab,     setTab]     = useState('farmers');
  const [farmers, setFarmers] = useState([]);
  const [dash,    setDash]    = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [f, d] = await Promise.all([
      farmerAPI.getAll({ role:'farmer', limit:50 }),
      adminAPI.dashboard(),
    ]);
    setFarmers(f.data || []);
    setDash(d.data    || null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const verify = async id => {
    try { await adminAPI.verifyFarmer(id); toast.success('Farmer verified ✓'); load(); }
    catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const remove = async id => {
    if (!window.confirm('Remove this farmer?')) return;
    try { await farmerAPI.remove(id); toast.success('Removed'); load(); }
    catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const farmerCols = [
    { header:'Name',     render: r => <b>{r.name}</b> },
    { header:'Phone',    key:'phone' },
    { header:'Location', render: r => `${r.location?.district || '—'}, ${r.location?.state || ''}` },
    { header:'Land',     render: r => r.landSize ? `${r.landSize} ac` : '—' },
    { header:'Crop',     key:'primaryCrop' },
    { header:'Status',   render: r => <Badge label={r.isVerified ? 'Verified' : 'Pending'} color={r.isVerified ? 'green' : 'yellow'} /> },
    { header:'Joined',   render: r => formatDate(r.createdAt) },
    { header:'Actions',  render: r => (
      <div style={{ display:'flex', gap:6 }}>
        {!r.isVerified && <Btn onClick={() => verify(r._id)} style={{ padding:'4px 10px', fontSize:11 }}>Verify</Btn>}
        <Btn variant="danger" onClick={() => remove(r._id)} style={{ padding:'4px 10px', fontSize:11 }}>Remove</Btn>
      </div>
    )},
  ];

  const TABS = [
    { key:'farmers',      label:'👨‍🌾 Farmers'      },
    { key:'buyers',       label:'🛒 Buyers'        },
    { key:'transactions', label:'💰 Transactions'  },
    { key:'reports',      label:'📊 Reports'       },
  ];

  return (
    <div>
      <PageHeader icon="⚙️" title="Admin Panel" subtitle="Manage users, transactions and system settings" />

      {/* DASH STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard icon="👨‍🌾" value={dash?.totalFarmers  || '—'} label="Total Farmers"   accent="#6fcf97" />
        <StatCard icon="🛒" value={dash?.totalBuyers   || '—'} label="Registered Buyers" accent="#56ccf2" />
        <StatCard icon="📦" value={dash?.totalOrders   || '—'} label="Total Orders"    accent="#f2c94c" />
        <StatCard icon="💰" value={formatCurrency(dash?.revenue || 0)} label="Total Revenue"  accent="#6fcf97" />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'farmers' && (
        <Card title="Farmer Management">
          {loading ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
            : <Table columns={farmerCols} data={farmers} emptyMsg="No farmers found." />}
        </Card>
      )}

      {tab === 'buyers' && (
        <Card title="Buyer Management">
          {loading ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
            : <Table
                columns={[
                  { header:'Name',   render: r => <b>{r.name}</b> },
                  { header:'Phone',  key:'phone' },
                  { header:'Email',  key:'email' },
                  { header:'Status', render: r => <Badge label={r.isVerified?'Active':'Pending'} color={r.isVerified?'green':'yellow'} /> },
                  { header:'Joined', render: r => formatDate(r.createdAt) },
                ]}
                data={farmers.filter(f => f.role === 'buyer')}
                emptyMsg="No buyers registered yet."
              />
          }
        </Card>
      )}

      {tab === 'transactions' && (
        <Card title="Transaction Monitor">
          <div style={{ textAlign:'center', padding:40, color:'var(--muted)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>💳</div>
            Connect payment gateway to view transactions.<br/>
            <span style={{ fontSize:12 }}>Orders are tracked in the Market module.</span>
          </div>
        </Card>
      )}

      {tab === 'reports' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {[
            { icon:'📊', title:'Monthly Sales Report',    desc:'Crop sales and revenue by month',          date:'Feb 2025' },
            { icon:'👥', title:'User Activity Report',    desc:'Farmer and buyer registrations',           date:'Feb 2025' },
            { icon:'📋', title:'Scheme Disbursement',     desc:'Government scheme applications & approvals',date:'Jan 2025' },
            { icon:'🌾', title:'Crop Yield Analysis',     desc:'Yield comparison by crop type and region', date:'Kharif 2024' },
          ].map((r,i) => (
            <Card key={i}>
              <div style={{ display:'flex', gap:14 }}>
                <div style={{ fontSize:28 }}>{r.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{r.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', marginBottom:8 }}>{r.desc}</div>
                  <div style={{ fontSize:10, fontFamily:"'Space Mono',monospace", color:'var(--wheat)', marginBottom:12 }}>{r.date}</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn variant="ghost"   style={{ flex:1, fontSize:11 }}>📥 Download</Btn>
                    <Btn variant="outline" style={{ flex:1, fontSize:11 }}>📊 Preview</Btn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
