const mongoose = require('mongoose');

const leadSourceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  repeatAlert: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('LeadSource', leadSourceSchema);
