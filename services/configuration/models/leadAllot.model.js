const mongoose = require('mongoose');

const leadAllotSchema = new mongoose.Schema({
  leadIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true }],
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  allottedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('LeadAllot', leadAllotSchema);
