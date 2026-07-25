const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromAlias: { type: String, trim: true },
    to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    body: { type: String, required: [true, 'Mail body is required'] },
    attachments: [{ filename: String, url: String, size: Number }],
    isUrgent: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    folder: { type: String, default: 'inbox' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'MailGroup' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mailSchema.index({ from: 1, createdAt: -1 });
mailSchema.index({ to: 1, createdAt: -1 });

const mailGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const mailFolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    color: { type: String, default: '#1f375b' },
  },
  { timestamps: true }
);

const Mail = mongoose.model('Mail', mailSchema);
const MailGroup = mongoose.model('MailGroup', mailGroupSchema);
const MailFolder = mongoose.model('MailFolder', mailFolderSchema);

module.exports = { Mail, MailGroup, MailFolder };
