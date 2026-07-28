const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true }
});

const mailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: [{ type: String, required: true }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  subject: { type: String },
  htmlBody: { type: String },
  plainTextBody: { type: String },
  attachments: [attachmentSchema],
  status: { type: String, enum: ['draft', 'sent', 'failed'], default: 'draft' },
  isRead: { type: Boolean, default: false },
  deliveryStatus: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  errorMessage: { type: String }
}, { timestamps: true });

// Indexes for faster queries
mailSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.models.Mail || mongoose.model('Mail', mailSchema);
