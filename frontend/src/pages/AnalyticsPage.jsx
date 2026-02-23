import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { adminAPI, cropAPI, marketAPI } from '../services/api';
import { Card, StatCard, PageHeader } from '../components/UI';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#6fcf97','#f2c94c','#56ccf2','#eb5757','#bb87fc','#f2994a'];

const demandSupply = [
  { crop:'Wheat',   demand:1400, supply:1200 },
  { crop:'Rice',    demand:1200, supply:800  },
  { crop:'Tomato',  demand:350,  supply:500  },
  { crop:'Soybean', demand:400,  supply:300  },
  { crop:'Cotton',  demand:220,  supply:180  },
];

const monthlyRevenue = [
  { month:'Apr', revenue:380000 }, { month:'May', revenue:420000 }, { month:'Jun', revenue:310000 },
  { month:'Jul', revenue:490000 }, { month:'Aug', revenue:520000 }, { month:'Sep', revenue:410000 },
  { month:'Oct', revenue:580000 }, { month:'Nov', revenue:490000 }, { month:'Dec', revenue:640000 },
  { month:'Jan', revenue:560000 }, { month:'Feb', revenue:610000 },
];

export default function AnalyticsPage() {
  const [cropData, setCropData] = useState([]);
  const [dash,     setDash]     = useState(null);

  useEffect(() => {
    cropAPI.getAll().then(r => {
      const grouped = {};
      (r.data || []).forEach(c => { grouped[c.cropType] = (grouped[c.cropType] || 0) + 1; });
      setCropData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    });
  }, []);

  return (
    <div>
      <PageHeader icon="📊" title="Analytics & Reports" subtitle="Insights, trends and performance metrics" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard icon="💰" value={formatCurrency(4860000)} label="Total Revenue FY25" change="▲ 22% vs FY24" accent="#f2c94c" />
        <StatCard icon="🌾" value="1,840 qtl" label="Total Yield" change="▲ 15% vs last season" accent="#6fcf97" />
        <StatCard icon="👥" value="284" label="Active Buyers" change="▲ 32 new this quarter" accent="#56ccf2" />
        <StatCard icon="💹" value={formatCurrency(2340)} label="Avg Price/qtl" change="▲ 8% this month" accent="#6fcf97" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20, marginBottom:20 }}>
        <Card title="Monthly Revenue (₹)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} margin={{ top:0, right:0, bottom:0, left:-10 }}>
              <XAxis dataKey="month" tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'#1e3324', border:'1px solid rgba(111,207,151,0.2)', borderRadius:8, color:'#e8f5e4' }} formatter={v => [formatCurrency(v), 'Revenue']} />
              <Bar dataKey="revenue" fill="#6fcf97" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Crop Distribution">
          {cropData.length === 0
            ? <div style={{ color:'var(--muted)', fontSize:13 }}>Add crops to see distribution.</div>
            : <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={cropData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}
                    style={{ fontSize:10, fill:'rgba(232,245,228,0.7)' }}>
                    {cropData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background:'#1e3324', border:'1px solid rgba(111,207,151,0.2)', borderRadius:8, color:'#e8f5e4' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
                {cropData.map((c, i) => (
                  <div key={c.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }} />
                    {c.name} ({c.value})
                  </div>
                ))}
              </div>
            </>
          }
        </Card>
      </div>

      <Card title="Crop Demand vs Supply Analysis">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={demandSupply} margin={{ top:0, right:0, bottom:0, left:-10 }}>
            <XAxis dataKey="crop" tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background:'#1e3324', border:'1px solid rgba(111,207,151,0.2)', borderRadius:8, color:'#e8f5e4' }} />
            <Legend wrapperStyle={{ color:'rgba(232,245,228,0.5)', fontSize:12 }} />
            <Bar dataKey="demand" name="Demand (qtl)" fill="#f2c94c" radius={[4,4,0,0]} />
            <Bar dataKey="supply" name="Supply (qtl)" fill="#6fcf97" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
