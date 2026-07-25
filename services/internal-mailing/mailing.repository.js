const { Mail, MailGroup, MailFolder } = require('./mailing.model');

// ─── Mail ────────────────────────────────────────────────────────────
const createMail = async (data) => Mail.create(data);

const getInbox = async (userId, pagination = {}) => {
  const total = await Mail.countDocuments({ to: userId, isDeleted: false });
  const mails = await Mail.find({ to: userId, isDeleted: false })
    .populate('from', 'name email')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ createdAt: -1 });
  return { mails, total };
};

const getSent = async (userId, pagination = {}) => {
  const total = await Mail.countDocuments({ from: userId, isDeleted: false });
  const mails = await Mail.find({ from: userId, isDeleted: false })
    .populate('to', 'name email')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ createdAt: -1 });
  return { mails, total };
};

const getMailById = async (id) => {
  return Mail.findById(id).populate('from to', 'name email');
};

const deleteMail = async (id) => {
  return Mail.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const moveMail = async (id, folder) => {
  return Mail.findByIdAndUpdate(id, { folder }, { new: true });
};

// ─── Groups ──────────────────────────────────────────────────────────
const getGroups = async (userId) => {
  return MailGroup.find({ createdBy: userId }).populate('members', 'name email');
};

const createGroup = async (data) => MailGroup.create(data);

const updateGroup = async (id, data) => {
  return MailGroup.findByIdAndUpdate(id, data, { new: true }).populate('members', 'name email');
};

const deleteGroup = async (id) => MailGroup.findByIdAndDelete(id);

// ─── Folders ─────────────────────────────────────────────────────────
const getFolders = async (userId) => {
  return MailFolder.find({ user: userId }).sort({ name: 1 });
};

const createFolder = async (data) => MailFolder.create(data);

module.exports = {
  createMail, getInbox, getSent, getMailById, deleteMail, moveMail,
  getGroups, createGroup, updateGroup, deleteGroup,
  getFolders, createFolder,
};
