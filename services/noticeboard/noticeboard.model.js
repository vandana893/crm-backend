const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    notice: {
      type: String,
      required: [true, 'Notice content is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetProfiles: [{
      type: String,
    }],
    targetEmployees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

noticeSchema.index({ fromDate: 1, toDate: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
