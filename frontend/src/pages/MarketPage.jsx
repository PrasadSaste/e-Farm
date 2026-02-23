import React, { useEffect, useState } from 'react';
import { marketAPI } from '../services/api';
import { Card, Btn, Badge, Table, Modal, Input, PageHeader, Tabs } from '../components/UI';
import { formatCurrency, formatDate, CROP_TYPES } from '../utils/helpers';
import toast from 'react-hot-toast';

const blankListing = { cropType:'Wheat', quantity:'', pricePerQtl:'', grade:'A', description:'', availableFrom:'' };

export default function MarketPage() {
  const [tab,      setTab]      = useState('browse');
  const [listings, setListings] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [prices,   setPrices]   = useState([]);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(blankListing);
  const [buyModal, setBuyModal] = useState(null);
  const [buyQty,   setBuyQty]   = useState('');
  const [loading,  setLoading]  = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [l, o, p] = await Promise.all([marketAPI.getListings(), marketAPI.getOrders(), marketAPI.getPrices()]);
    setListings(l.data || []);
    setOrders(o.data   || []);
    setPrices(p.data   || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const createListing = async e => {
    e.preventDefault();
    try { await marketAPI.createListing(form); toast.success('Listing created!'); setModal(false); loadAll(); }
    catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const placeOrder = async () => {
    try {
      await marketAPI.createOrder({ listingId: buyModal._id, quantity: +buyQty });
      toast.success('Order placed successfully! 🛒');
      setBuyModal(null); setBuyQty('');
      loadAll();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const listCols = [
    { header:'Crop',    render: r => <b>{r.cropType}</b> },
    { header:'Farmer',  render: r => r.farmerId?.name || '—' },
    { header:'Qty',     render: r => `${r.quantity} qtl` },
    { header:'Price',   render: r => <span style={{ fontFamily:"'Playfair Display',serif", color:'var(--wheat)', fontWeight:700 }}>{formatCurrency(r.pricePerQtl)}/qtl</span> },
    { header:'Grade',   render: r => <Badge label={`Grade ${r.grade}`} color="green" /> },
    { header:'Available', render: r => formatDate(r.availableFrom) },
    { header:'Action',  render: r => <Btn onClick={() => { setBuyModal(r); setBuyQty(''); }} style={{ padding:'5px 12px', fontSize:12 }}>Buy Now</Btn> },
  ];

  const orderCols = [
    { header:'Crop',    key:'cropType' },
    { header:'Qty',     render: r => `${r.quantity} qtl` },
    { header:'Amount',  render: r => <span style={{ color:'var(--green)', fontWeight:700 }}>{formatCurrency(r.totalAmount)}</span> },
    { header:'Buyer',   render: r => r.buyerId?.name || '—' },
    { header:'Farmer',  render: r => r.farmerId?.name || '—' },
    { header:'Status',  render: r => <Badge label={r.status} color={r.status==='Delivered'?'green':r.status==='In Transit'?'yellow':r.status==='Cancelled'?'red':'blue'} /> },
    { header:'Date',    render: r => formatDate(r.createdAt) },
  ];

  const TABS = [{ key:'browse', label:'🛒 Browse Listings' }, { key:'sell', label:'📦 Sell Crops' }, { key:'orders', label:'📋 Orders' }, { key:'prices', label:'📈 Price Trends' }];

  return (
    <div>
      <PageHeader icon="🛒" title="Market & E-Commerce" subtitle="Buy and sell crops directly — no middlemen" />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'browse' && (
        <Card title="Available Listings">
          {loading ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
            : <Table columns={listCols} data={listings} emptyMsg="No listings available right now." />}
        </Card>
      )}

      {tab === 'sell' && (
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:20 }}>
          <Card title="Create New Listing">
            <form onSubmit={createListing}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Input label="Crop Type" type="select" name="cropType" value={form.cropType} onChange={handle}
                  options={CROP_TYPES.map(c => ({ value:c, label:c }))} />
                <Input label="Quantity (qtl)" type="number" name="quantity" value={form.quantity} onChange={handle} placeholder="e.g. 100" required />
                <Input label="Price ₹/qtl" type="number" name="pricePerQtl" value={form.pricePerQtl} onChange={handle} placeholder="e.g. 2100" required />
                <Input label="Grade" type="select" name="grade" value={form.grade} onChange={handle} options={['A','B','C'].map(g => ({ value:g, label:`Grade ${g}` }))} />
                <Input label="Available From" type="date" name="availableFrom" value={form.availableFrom} onChange={handle} />
              </div>
              <Input label="Description" type="textarea" name="description" value={form.description} onChange={handle} placeholder="Quality details, certifications, etc." />
              <Btn type="submit" style={{ width:'100%', padding:12 }}>Create Listing 📦</Btn>
            </form>
          </Card>
          <Card title="My Active Listings">
            {listings.length === 0
              ? <p style={{ color:'var(--muted)', fontSize:13 }}>No listings yet.</p>
              : listings.map(l => (
                <div key={l._id} style={{ padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{l.cropType}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{l.quantity} qtl · {formatCurrency(l.pricePerQtl)}/qtl</div>
                    </div>
                    <Badge label={l.isActive ? 'Active' : 'Sold Out'} color={l.isActive ? 'green' : 'gray'} />
                  </div>
                </div>
              ))
            }
          </Card>
        </div>
      )}

      {tab === 'orders' && (
        <Card title="Order History">
          {loading ? <div style={{ color:'var(--muted)', padding:20 }}>Loading...</div>
            : <Table columns={orderCols} data={orders} emptyMsg="No orders yet." />}
        </Card>
      )}

      {tab === 'prices' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {prices.map((p, i) => (
            <Card key={i}>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>{p.market}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900 }}>{p.cropType}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:'var(--wheat)', margin:'8px 0' }}>{formatCurrency(p.modalPrice)}<span style={{ fontSize:13, color:'var(--muted)', fontFamily:"'DM Sans'" }}>/qtl</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--muted)' }}>
                <span>Min: {formatCurrency(p.minPrice)}</span>
                <span>Max: {formatCurrency(p.maxPrice)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* BUY MODAL */}
      <Modal open={!!buyModal} onClose={() => setBuyModal(null)} title={`Buy ${buyModal?.cropType}`}>
        {buyModal && (
          <div>
            <div style={{ background:'rgba(111,207,151,0.06)', borderRadius:10, padding:16, marginBottom:16 }}>
              <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>Seller: {buyModal.farmerId?.name}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:'var(--wheat)' }}>{formatCurrency(buyModal.pricePerQtl)}/qtl</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>Available: {buyModal.quantity} qtl</div>
            </div>
            <Input label="Quantity to Buy (qtl)" type="number" value={buyQty} onChange={e => setBuyQty(e.target.value)} placeholder={`Max ${buyModal.quantity}`} />
            {buyQty && <div style={{ fontSize:14, color:'var(--green)', fontWeight:700, marginBottom:16 }}>Total: {formatCurrency(+buyQty * buyModal.pricePerQtl)}</div>}
            <div style={{ display:'flex', gap:10 }}>
              <Btn onClick={placeOrder} disabled={!buyQty || +buyQty > buyModal.quantity} style={{ flex:1, padding:12 }}>Confirm Order 🛒</Btn>
              <Btn variant="outline" onClick={() => setBuyModal(null)} style={{ flex:1, padding:12 }}>Cancel</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
