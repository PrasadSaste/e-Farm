import React, { useEffect, useState } from 'react';
import { cropAPI } from '../services/api';
import { Card, Btn, Badge, ProgressBar, Table, Modal, Input, PageHeader } from '../components/UI';
import { stageColor, formatDate, CROP_TYPES } from '../utils/helpers';
import toast from 'react-hot-toast';

const STAGES = ['Planning','Sowing','Growing','Harvest','Sold'];

const blank = { cropType:'Wheat', area:'', stage:'Planning', progress:0, sowDate:'', harvestDate:'', yieldEstimate:'', notes:'' };

export default function CropsPage() {
  const [crops,   setCrops]   = useState([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(blank);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState(null);

  const load = () => cropAPI.getAll().then(r => setCrops(r.data || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = c  => { setEditing(c); setForm({ cropType:c.cropType, area:c.area, stage:c.stage, progress:c.progress, sowDate:c.sowDate?.slice(0,10)||'', harvestDate:c.harvestDate?.slice(0,10)||'', yieldEstimate:c.yieldEstimate||'', notes:c.notes||'' }); setModal(true); };

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await cropAPI.update(editing._id, form);
        toast.success('Crop updated!');
      } else {
        await cropAPI.create(form);
        toast.success('Crop added! 🌱');
      }
      setModal(false);
      load();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this crop?')) return;
    try { await cropAPI.remove(id); toast.success('Crop removed'); load(); }
    catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const fetchAdvisory = async c => {
    try { const r = await cropAPI.getAdvisory(c._id); setAdvisory({ crop:c.cropType, ...r.data }); }
    catch { toast.error('Advisory not available'); }
  };

  const columns = [
    { header:'Crop',     render: r => <b>{r.cropType}</b> },
    { header:'Area',     render: r => `${r.area} acres` },
    { header:'Stage',    render: r => <Badge label={r.stage} color={r.stage==='Harvest'?'yellow':r.stage==='Growing'?'green':r.stage==='Sowing'?'blue':'gray'} /> },
    { header:'Progress', render: r => <div style={{ minWidth:120 }}><ProgressBar value={r.progress} color={stageColor(r.stage)} label="" /></div> },
    { header:'Sown',     render: r => formatDate(r.sowDate) },
    { header:'Harvest',  render: r => formatDate(r.harvestDate) },
    { header:'Yield (est)', render: r => r.yieldEstimate ? `${r.yieldEstimate} qtl` : '—' },
    { header:'Actions',  render: r => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn variant="ghost"   onClick={() => openEdit(r)}     style={{ padding:'4px 10px', fontSize:11 }}>Edit</Btn>
        <Btn variant="ghost"   onClick={() => fetchAdvisory(r)} style={{ padding:'4px 10px', fontSize:11 }}>Advisory</Btn>
        <Btn variant="danger"  onClick={() => remove(r._id)}   style={{ padding:'4px 10px', fontSize:11 }}>Delete</Btn>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader icon="🌾" title="Crop Management" subtitle="Track crop lifecycle, schedules and advisories"
        action={<Btn onClick={openNew}>+ Add Crop</Btn>} />

      {/* SUMMARY CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
        {STAGES.map(stage => {
          const count = crops.filter(c => c.stage === stage).length;
          return (
            <div key={stage} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:14, textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:'var(--wheat)' }}>{count}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>{stage}</div>
            </div>
          );
        })}
      </div>

      <Card title="All Crops">
        {loading
          ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
          : <Table columns={columns} data={crops} emptyMsg="No crops yet. Add your first crop!" />
        }
      </Card>

      {/* Advisory panel */}
      {advisory && (
        <Card title="🔬 Disease Advisory" style={{ marginTop:20 }} action={<Btn variant="ghost" onClick={() => setAdvisory(null)} style={{ padding:'4px 10px', fontSize:11 }}>Close</Btn>}>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>Crop</div>
              <div style={{ fontWeight:700, fontSize:16 }}>{advisory.crop}</div>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>Disease Risk</div>
              <Badge label={advisory.disease} color={advisory.risk==='High'?'red':advisory.risk==='Medium'?'yellow':'green'} />
              <span style={{ marginLeft:8, fontSize:12 }}>{advisory.risk} Risk</span>
            </div>
            <div style={{ flex:2, minWidth:300 }}>
              <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>Recommended Action</div>
              <div style={{ fontSize:13, color:'var(--cream)', background:'rgba(111,207,151,0.06)', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(111,207,151,0.15)' }}>{advisory.advice}</div>
            </div>
          </div>
        </Card>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Crop' : 'Add New Crop'}>
        <form onSubmit={save}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Crop Type" type="select" name="cropType" value={form.cropType} onChange={handle}
              options={CROP_TYPES.map(c => ({ value:c, label:c }))} />
            <Input label="Area (acres)" type="number" name="area" value={form.area} onChange={handle} placeholder="e.g. 5" required />
            <Input label="Stage" type="select" name="stage" value={form.stage} onChange={handle}
              options={STAGES.map(s => ({ value:s, label:s }))} />
            <Input label="Progress (%)" type="number" name="progress" value={form.progress} onChange={handle} placeholder="0-100" />
            <Input label="Sow Date"     type="date" name="sowDate"     value={form.sowDate}     onChange={handle} />
            <Input label="Harvest Date" type="date" name="harvestDate" value={form.harvestDate} onChange={handle} />
            <Input label="Yield Estimate (qtl)" type="number" name="yieldEstimate" value={form.yieldEstimate} onChange={handle} placeholder="e.g. 50" />
          </div>
          <Input label="Notes" type="textarea" name="notes" value={form.notes} onChange={handle} placeholder="Any additional notes..." />
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <Btn type="submit" style={{ flex:1 }}>{editing ? 'Update Crop' : 'Add Crop 🌱'}</Btn>
            <Btn variant="outline" onClick={() => setModal(false)} style={{ flex:1 }}>Cancel</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
