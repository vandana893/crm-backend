const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  leader: { type: mongoose.Schema.Types.Mixed },
  members: [{ type: mongoose.Schema.Types.Mixed }],
  department: { type: mongoose.Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Team', teamSchema);
