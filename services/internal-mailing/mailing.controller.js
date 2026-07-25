const mailingRepository = require('./mailing.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// POST /api/mailing/compose
const composeMail = async (req, res, next) => {
  try {
    const data = { ...req.body, from: req.user.id };
    const mail = await mailingRepository.createMail(data);
    return createdResponse(res, 'Mail sent successfully', mail);
  } catch (error) { next(error); }
};

// GET /api/mailing/inbox
const getInbox = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { mails, total } = await mailingRepository.getInbox(req.user.id, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);
    return successResponse(res, 'Inbox fetched', mails, 200, pagination);
  } catch (error) { next(error); }
};

// GET /api/mailing/sent
const getSent = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { mails, total } = await mailingRepository.getSent(req.user.id, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);
    return successResponse(res, 'Sent mails fetched', mails, 200, pagination);
  } catch (error) { next(error); }
};

// GET /api/mailing/:id
const getMailById = async (req, res, next) => {
  try {
    const mail = await mailingRepository.getMailById(req.params.id);
    if (!mail) return errorResponse(res, 'Mail not found', 404);
    return successResponse(res, 'Mail fetched', mail);
  } catch (error) { next(error); }
};

// DELETE /api/mailing/:id
const deleteMail = async (req, res, next) => {
  try {
    const mail = await mailingRepository.deleteMail(req.params.id);
    if (!mail) return errorResponse(res, 'Mail not found', 404);
    return successResponse(res, 'Mail deleted');
  } catch (error) { next(error); }
};

// PATCH /api/mailing/:id/move
const moveMail = async (req, res, next) => {
  try {
    const mail = await mailingRepository.moveMail(req.params.id, req.body.folder);
    if (!mail) return errorResponse(res, 'Mail not found', 404);
    return successResponse(res, 'Mail moved', mail);
  } catch (error) { next(error); }
};

// GET /api/mailing/groups
const getGroups = async (req, res, next) => {
  try {
    const groups = await mailingRepository.getGroups(req.user.id);
    return successResponse(res, 'Groups fetched', groups);
  } catch (error) { next(error); }
};

// POST /api/mailing/groups
const createGroup = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const group = await mailingRepository.createGroup(data);
    return createdResponse(res, 'Group created', group);
  } catch (error) { next(error); }
};

// PUT /api/mailing/groups/:id
const updateGroup = async (req, res, next) => {
  try {
    const group = await mailingRepository.updateGroup(req.params.id, req.body);
    if (!group) return errorResponse(res, 'Group not found', 404);
    return successResponse(res, 'Group updated', group);
  } catch (error) { next(error); }
};

// DELETE /api/mailing/groups/:id
const deleteGroup = async (req, res, next) => {
  try {
    const group = await mailingRepository.deleteGroup(req.params.id);
    if (!group) return errorResponse(res, 'Group not found', 404);
    return successResponse(res, 'Group deleted');
  } catch (error) { next(error); }
};

// GET /api/mailing/folders
const getFolders = async (req, res, next) => {
  try {
    const folders = await mailingRepository.getFolders(req.user.id);
    return successResponse(res, 'Folders fetched', folders);
  } catch (error) { next(error); }
};

// POST /api/mailing/folders
const createFolder = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const folder = await mailingRepository.createFolder(data);
    return createdResponse(res, 'Folder created', folder);
  } catch (error) { next(error); }
};

module.exports = {
  composeMail, getInbox, getSent, getMailById, deleteMail, moveMail,
  getGroups, createGroup, updateGroup, deleteGroup,
  getFolders, createFolder,
};
