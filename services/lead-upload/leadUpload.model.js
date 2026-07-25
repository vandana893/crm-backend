const mongoose = require('mongoose');

const leadUploadBatchSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Lead source is required'],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    uploadType: {
      type: String,
      enum: ['csv', 'paste'],
      required: true,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeadUploadBatch', leadUploadBatchSchema);
