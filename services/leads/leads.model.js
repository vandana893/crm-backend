const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: {
      type: String,
      trim: true,
      default: '',
    },
    fatherName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    response: {
      type: String,
      enum: ['New', 'Call Back', 'Interested', 'Busy', 'Not Reachable', 'Switch Off', 'Not Interested', 'Followup', 'Ac. Process', 'Ac. Denied', 'Ac. Approved', 'Fund Pending', 'Fund Added', 'Trade Done', 'Disposed'],
      default: 'New',
    },
    dmat: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['Premium Lead', 'HNI Lead', 'Web Lead', 'Fresh Lead', 'SEO', 'Pipeline', 'Fresh'],
      required: [true, 'Lead source is required'],
    },
    type: {
      type: String,
      enum: ['Normal', 'Hot', 'Instant'],
      default: 'Normal',
    },
    callbackDate: {
      type: Date,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    segment: {
      type: String,
      trim: true,
    },
    investment: {
      type: String,
      enum: ['Below 50k', '50k to 1 lac', '1 lac to 5 lac', '5 lac to 10 lac', '10 lac +', ''],
      default: '',
    },
    profile: {
      type: String,
      enum: ['Trader', 'Businessmen', 'Student', 'Investor', 'Dabba Tracker', 'Fresher', ''],
      default: '',
    },
    experience: {
      type: String,
      enum: ['Not Started', 'Fresher', 'Below 1 Year', '1-5 Year', '5-10 Year', ''],
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDND: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries on common filters
leadSchema.index({ owner: 1, response: 1, source: 1 });
leadSchema.index({ mobile: 1 });
leadSchema.index({ type: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
