const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    acTarget: {
      type: Number,
      default: 0,
    },
    fundedAcTarget: {
      type: Number,
      default: 0,
    },
    fundMarginTarget: {
      type: Number,
      default: 0,
    },
    brokerageTarget: {
      type: Number,
      default: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['monthly', 'fixed'],
      default: 'monthly',
    },
    achieved: {
      acDone: { type: Number, default: 0 },
      fundedAcDone: { type: Number, default: 0 },
      fundMarginDone: { type: Number, default: 0 },
      brokerageDone: { type: Number, default: 0 },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

targetSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Target', targetSchema);
