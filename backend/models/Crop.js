const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropType:   { type: String, required: true },
  area:       { type: Number, required: true },
  stage:      { type: String, enum: ['Planning', 'Sowing', 'Growing', 'Harvest', 'Sold'], default: 'Planning' },
  progress:   { type: Number, default: 0, min: 0, max: 100 },
  sowDate:    { type: Date },
  harvestDate:{ type: Date },
  yieldEstimate: { type: Number },
  actualYield:   { type: Number },
  fertilizerSchedule: [{
    name:    String,
    qty:     String,
    date:    Date,
    applied: { type: Boolean, default: false },
  }],
  pesticideSchedule: [{
    name:    String,
    dosage:  String,
    date:    Date,
    applied: { type: Boolean, default: false },
  }],
  diseaseAlerts: [{
    disease:  String,
    risk:     { type: String, enum: ['Low', 'Medium', 'High'] },
    advisory: String,
    date:     Date,
  }],
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
