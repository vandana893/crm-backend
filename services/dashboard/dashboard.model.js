const mongoose = require('mongoose');

const kpiSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAccount: { type: String, default: '0/0' },
    fundedAccount: { type: String, default: '0/0' },
    fundTarget: { type: Number, default: 0 },
    fromAccount: { type: Number, default: 0 },
    brokerageTarget: { type: Number, default: 0 },
    brokerage: { type: Number, default: 0 },
    followUps: { type: Number, default: 0 },
    leadsModified: { type: Number, default: 0 },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KpiSnapshot', kpiSnapshotSchema);
