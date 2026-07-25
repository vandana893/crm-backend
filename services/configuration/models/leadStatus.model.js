const mongoose = require('mongoose');

const leadStatusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  colorCode: { type: String, default: '#000000' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('LeadStatus', leadStatusSchema);
