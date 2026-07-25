const mongoose = require('mongoose');

const leadRecycleSchema = new mongoose.Schema({
  filters: { type: mongoose.Schema.Types.Mixed },
  recycledCount: { type: Number, default: 0 },
  recycledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('LeadRecycle', leadRecycleSchema);
