const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: {
    leads: { type: Boolean, default: false },
    configuration: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    calling: { type: Boolean, default: false },
    targets: { type: Boolean, default: false },
    noticeboard: { type: Boolean, default: false },
    mailing: { type: Boolean, default: false },
    chatting: { type: Boolean, default: false },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
