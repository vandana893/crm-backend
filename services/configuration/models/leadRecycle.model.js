const mongoose = require('mongoose');

const leadRecycleSchema = new mongoose.Schema({
  filters: { type: mongoose.Schema.Types.Mixed },
  recycledCount: { type: Number, default: 0 },
  recycledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: mongoose.Schema.Types.Mixed, default: 'Completed' },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('LeadRecycle', leadRecycleSchema);
