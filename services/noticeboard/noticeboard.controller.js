const noticeRepository = require('./noticeboard.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// GET /api/noticeboard
const getNotices = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { notices, total } = await noticeRepository.findAll(req.query, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'Notices fetched', notices, 200, pagination);
  } catch (error) { next(error); }
};

// POST /api/noticeboard
const createNotice = async (req, res, next) => {
  try {
    const data = { ...req.body, createdByUser: req.user.id };
    const notice = await noticeRepository.create(data);
    return createdResponse(res, 'Notice created', notice);
  } catch (error) { next(error); }
};

// PUT /api/noticeboard/:id
const updateNotice = async (req, res, next) => {
  try {
    const notice = await noticeRepository.updateById(req.params.id, req.body);
    if (!notice) return errorResponse(res, 'Notice not found', 404);
    return successResponse(res, 'Notice updated', notice);
  } catch (error) { next(error); }
};

// DELETE /api/noticeboard/:id
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await noticeRepository.deleteById(req.params.id);
    if (!notice) return errorResponse(res, 'Notice not found', 404);
    return successResponse(res, 'Notice deleted');
  } catch (error) { next(error); }
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
