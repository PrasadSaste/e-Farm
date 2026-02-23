import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cropAPI, marketAPI, weatherAPI } from '../services/api';
import { StatCard, Card, Badge, ProgressBar, AlertItem, PageHeader } from '../components/UI';
import { stageColor, formatCurrency, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const priceHistory = [
  { month:'Sep', price:1950 }, { month:'Oct', price:2050 }, { month:'Nov', price:1980 },
  { month:'Dec', price:2080 }, { month:'Jan', price:2060 }, { month:'Feb', price:2100 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [crops,   setCrops]   = useState([]);
  const [weather, setWeather] = useState(null);
  const [prices,  setPrices]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      cropAPI.getAll(),
      weatherAPI.getForecast({ lat:18.52, lon:73.85 }),
      marketAPI.getPrices(),
    ]).then(([c, w, p]) => {
      setCrops(c.data   || []);
      setWeather(w.data || null);
      setPrices(p.data  || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeCrops   = crops.filter(c => c.stage !== 'Sold');
  const readyHarvest  = crops.filter(c => c.stage === 'Harvest').length;

  return (
    <div>
      <PageHeader icon="🏡" title="Dashboard" subtitle={`Welcome back, ${user?.name}! Here's your farm overview.`} />

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        <StatCard icon="🌾" value={activeCrops.length} label="Active Crops"   change={`${readyHarvest} ready to harvest`} changeType="up" accent="#6fcf97" />
        <StatCard icon="💰" value={formatCurrency(248600)} label="Revenue This Month" change="+18% vs last month" changeType="up" accent="#f2c94c" />
        <StatCard icon="🛒" value="36"  label="Pending Orders"    change="4 new today"   changeType="up" accent="#56ccf2" />
        <StatCard icon="📋" value="3"   label="Scheme Applications" change="1 approved"  changeType="up" accent="#6fcf97" />
      </div>

      {/* ROW 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20, marginBottom:20 }}>
        <Card title="My Active Crops">
          {loading ? <div style={{ color:'var(--muted)', fontSize:13 }}>Loading...</div>
            : activeCrops.length === 0
            ? <div style={{ color:'var(--muted)', fontSize:13, textAlign:'center', padding:20 }}>No crops yet. <Link to="/crops" style={{ color:'var(--green)' }}>Add a crop</Link></div>
            : activeCrops.slice(0,4).map(crop => (
              <div key={crop._id} style={{ display:'flex', gap:14, alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width:36, height:36, borderRadius:8, background:'rgba(111,207,151,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🌾</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:600 }}>{crop.cropType}</span>
                    <Badge label={crop.stage} color={crop.stage==='Harvest'?'yellow':crop.stage==='Growing'?'green':crop.stage==='Sowing'?'blue':'gray'} />
                  </div>
                  <ProgressBar value={crop.progress} color={stageColor(crop.stage)} />
                  <div style={{ fontSize:11, color:'var(--muted)', marginTop:3 }}>{crop.area} acres · Harvest: {formatDate(crop.harvestDate)}</div>
                </div>
              </div>
            ))
          }
          <div style={{ marginTop:14 }}>
            <Link to="/crops" style={{ fontSize:12, color:'var(--green)', fontWeight:600 }}>View all crops →</Link>
          </div>
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* WEATHER */}
          <Card title="Today's Weather">
            {weather ? (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
                  <div style={{ fontSize:52 }}>⛅</div>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:900, color:'var(--wheat)', lineHeight:1 }}>
                      {Math.round(weather.current?.main?.temp || 28)}°C
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', textTransform:'capitalize' }}>
                      {weather.current?.weather?.[0]?.description || 'Partly cloudy'}
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  {[['💧', `${weather.current?.main?.humidity || 72}%`, 'Humidity'],
                    ['💨', `${Math.round((weather.current?.wind?.speed||3.3)*3.6)} km/h`, 'Wind'],
                    ['🌡', `Feels ${Math.round(weather.current?.main?.feels_like||30)}°`, 'Feels Like'],
                  ].map(([ic,v,l]) => (
                    <div key={l} style={{ textAlign:'center', padding:8, background:'rgba(255,255,255,0.03)', borderRadius:8 }}>
                      <div>{ic}</div>
                      <div style={{ fontSize:13, fontWeight:600, margin:'2px 0' }}>{v}</div>
                      <div style={{ fontSize:10, color:'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                {weather.advisories?.[0] && (
                  <AlertItem icon="🌧" title={weather.advisories[0].message.split('.')[0]} message="" type="warning" />
                )}
              </>
            ) : <div style={{ color:'var(--muted)', fontSize:13 }}>Loading weather...</div>}
          </Card>
        </div>
      </div>

      {/* ROW 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Card title="Wheat Price Trend (₹/qtl)">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={priceHistory} margin={{ top:0, right:0, bottom:0, left:-20 }}>
              <XAxis dataKey="month" tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'rgba(232,245,228,0.4)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'#1e3324', border:'1px solid rgba(111,207,151,0.2)', borderRadius:8, color:'#e8f5e4' }} />
              <Bar dataKey="price" fill="#6fcf97" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Live Market Prices" action={<Link to="/market" style={{ fontSize:12, color:'var(--green)' }}>View Market →</Link>}>
          {prices.slice(0,5).map((p, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{p.cropType}</div>
                <div style={{ fontSize:11, color:'var(--muted)' }}>{p.market}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'var(--wheat)' }}>{formatCurrency(p.modalPrice)}<span style={{ fontSize:11, fontFamily:"'DM Sans',sans-serif", color:'var(--muted)' }}>/qtl</span></div>
                <div style={{ fontSize:10, color:'var(--green)', fontFamily:"'Space Mono',monospace" }}>▲ Live</div>
              </div>
            </div>
          ))}
          {prices.length === 0 && <div style={{ color:'var(--muted)', fontSize:13 }}>Loading prices...</div>}
        </Card>
      </div>
    </div>
  );
}
