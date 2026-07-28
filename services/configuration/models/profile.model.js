const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: [{ type: mongoose.Schema.Types.Mixed }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Profile', profileSchema);
