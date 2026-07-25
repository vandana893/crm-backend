const targetsRepository = require('./targets.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// GET /api/targets
const getTargets = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { targets, total } = await targetsRepository.findAll(req.query, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'Targets fetched', targets, 200, pagination);
  } catch (error) {
    next(error);
  }
};

// POST /api/targets
const createTarget = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user.id };
    const target = await targetsRepository.create(data);
    return createdResponse(res, 'Target created successfully', target);
  } catch (error) {
    next(error);
  }
};

// PUT /api/targets/:id
const updateTarget = async (req, res, next) => {
  try {
    const target = await targetsRepository.updateById(req.params.id, req.body);
    if (!target) return errorResponse(res, 'Target not found', 404);

    return successResponse(res, 'Target updated', target);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/targets/:id
const deleteTarget = async (req, res, next) => {
  try {
    const target = await targetsRepository.deleteById(req.params.id);
    if (!target) return errorResponse(res, 'Target not found', 404);

    return successResponse(res, 'Target deleted');
  } catch (error) {
    next(error);
  }
};

// GET /api/targets/monthly
const getMonthlyTargets = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const targets = await targetsRepository.findMonthly(month, year);
    return successResponse(res, 'Monthly targets fetched', targets);
  } catch (error) {
    next(error);
  }
};

// GET /api/targets/fixed
const getFixedTargets = async (req, res, next) => {
  try {
    const targets = await targetsRepository.findFixed();
    return successResponse(res, 'Fixed targets fetched', targets);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTargets, createTarget, updateTarget, deleteTarget, getMonthlyTargets, getFixedTargets };
