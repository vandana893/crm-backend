const mongoose = require('mongoose');

const fetchLimitSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  limit: { type: Number, required: true, default: 0 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

module.exports = mongoose.model('FetchLimit', fetchLimitSchema);
