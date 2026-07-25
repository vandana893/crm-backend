const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  website: { type: String, trim: true },
  logo: { type: String },
  gst: { type: String, trim: true },
  pan: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
