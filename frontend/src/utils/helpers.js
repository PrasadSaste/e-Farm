export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const stageColor = (stage) => ({
  Planning: '#56ccf2',
  Sowing:   '#f2994a',
  Growing:  '#6fcf97',
  Harvest:  '#f2c94c',
  Sold:     'rgba(232,245,228,0.3)',
}[stage] || '#6fcf97');

export const CROP_TYPES = ['Wheat','Rice','Sugarcane','Cotton','Tomato','Soybean','Maize','Potato','Onion','Chilli'];
export const STATES     = ['Maharashtra','Punjab','Gujarat','Uttar Pradesh','Madhya Pradesh','Rajasthan','Karnataka','Haryana'];
