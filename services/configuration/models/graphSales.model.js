const mongoose = require('mongoose');

const graphSalesSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  salesCount: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('GraphSales', graphSalesSchema);
