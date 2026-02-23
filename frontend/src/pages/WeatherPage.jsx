import React, { useEffect, useState } from 'react';
import { weatherAPI } from '../services/api';
import { Card, AlertItem, PageHeader } from '../components/UI';

const ICONS = { '01d':'☀️','02d':'⛅','10d':'🌧','09d':'⛈','03d':'☁️','04d':'🌥','13d':'❄️' };
const getIcon = code => ICONS[code] || '🌤';

export default function WeatherPage() {
  const [data,    setData]    = useState(null);
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      weatherAPI.getForecast({ lat:18.52, lon:73.85 }),
      weatherAPI.getAlerts(),
    ]).then(([w, a]) => {
      setData(w.data   || null);
      setAlerts(a.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color:'var(--muted)', padding:20 }}>Loading weather data...</div>;

  const curr = data?.current;

  return (
    <div>
      <PageHeader icon="🌤" title="Weather & Alerts" subtitle="Real-time forecasts and crop advisory" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* CURRENT */}
        <Card title="Current Conditions · Pune, MH">
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:72 }}>{getIcon(curr?.weather?.[0]?.icon)}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:60, fontWeight:900, color:'var(--wheat)', lineHeight:1, marginTop:8 }}>
              {Math.round(curr?.main?.temp ?? 28)}°C
            </div>
            <div style={{ fontSize:16, color:'var(--muted)', marginTop:8, textTransform:'capitalize' }}>
              {curr?.weather?.[0]?.description ?? 'Partly Cloudy'}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            {[
              ['💧', `${curr?.main?.humidity ?? 72}%`, 'Humidity'],
              ['💨', `${Math.round((curr?.wind?.speed ?? 3.3) * 3.6)} km/h`, 'Wind'],
              ['🌡', `${Math.round(curr?.main?.feels_like ?? 30)}°C`, 'Feels Like'],
            ].map(([ic,v,l]) => (
              <div key={l} style={{ textAlign:'center', background:'rgba(255,255,255,0.03)', borderRadius:10, padding:12 }}>
                <div style={{ fontSize:22 }}>{ic}</div>
                <div style={{ fontSize:16, fontWeight:700, margin:'4px 0' }}>{v}</div>
                <div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* FORECAST */}
        <Card title="5-Day Forecast">
          {(data?.forecast || []).slice(0, 5).map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize:11, color:'var(--muted)', fontFamily:"'Space Mono',monospace", width:100 }}>
                {new Date(f.dt_txt).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}
              </div>
              <div style={{ fontSize:24 }}>{getIcon(f.weather?.[0]?.icon)}</div>
              <div style={{ flex:1, fontSize:12, color:'var(--muted)', textTransform:'capitalize' }}>{f.weather?.[0]?.description}</div>
              <div style={{ fontWeight:700, fontSize:16 }}>{Math.round(f.main.temp)}°C</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>💧 {f.main.humidity}%</div>
            </div>
          ))}
        </Card>
      </div>

      {/* CROP ADVISORY */}
      <Card title="Crop Advisory Based on Weather" style={{ marginBottom:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {(data?.advisories || [
            { type:'warning', message:'Heavy rain forecast Feb 26-27. Cover stored harvests, delay fertilizer application by 3 days.' },
            { type:'info',    message:'Sunny conditions expected this weekend. Ideal time for pesticide spray on wheat fields.' },
            { type:'success', message:'Soil moisture adequate for wheat. No irrigation needed for next 5 days.' },
            { type:'info',    message:'Night temperatures dropping to 16°C. Protect nursery seedlings with mulching.' },
          ]).map((a, i) => (
            <AlertItem key={i} icon={a.type==='warning'?'🌧':a.type==='danger'?'⚠️':'☀️'} title={a.message.split('.')[0]} message={a.message.split('.').slice(1).join('.')} type={a.type} />
          ))}
        </div>
      </Card>

      {/* DB ALERTS */}
      {alerts.length > 0 && (
        <Card title="System Alerts">
          {alerts.map((a, i) => (
            <AlertItem key={i} icon={a.type==='weather'?'🌦':a.type==='pest'?'🐛':'📢'}
              title={a.title} message={a.message} type={a.severity} />
          ))}
        </Card>
      )}
    </div>
  );
}
