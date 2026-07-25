const mongoose = require('mongoose');

const dealerAllotSchema = new mongoose.Schema({
  leadIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true }],
  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required: true },
  allottedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('DealerAllot', dealerAllotSchema);
