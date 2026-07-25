const mongoose = require('mongoose');

// Agent schema — for monitor tab
const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    role: { type: String, required: true },
    ext: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    currentCallStatus: {
      type: String,
      enum: ['idle', 'on-call', 'ringing', 'hold'],
      default: 'idle',
    },
  },
  { timestamps: true }
);

// Call Log schema
const callLogSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    agentName: { type: String },
    agentRole: { type: String },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, default: '00:00:00' },
    type: {
      type: String,
      enum: ['Incoming', 'Outgoing'],
      default: 'Outgoing',
    },
    uniqueId: { type: String },
    recordingUrl: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

callLogSchema.index({ agent: 1, date: -1 });

// Calling Report schema
const callingReportSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String },
    role: { type: String },
    ext: { type: String },
    outgoingCalls: { type: Number, default: 0 },
    outgoingTime: { type: String, default: '00:00:00' },
    incomingCalls: { type: Number, default: 0 },
    incomingTime: { type: String, default: '00:00:00' },
    totalCalls: { type: Number, default: 0 },
    totalTime: { type: String, default: '00:00:00' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Agent = mongoose.model('Agent', agentSchema);
const CallLog = mongoose.model('CallLog', callLogSchema);
const CallingReport = mongoose.model('CallingReport', callingReportSchema);

module.exports = { Agent, CallLog, CallingReport };
