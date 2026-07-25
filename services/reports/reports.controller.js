const reportsRepository = require('./reports.repository');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// GET /api/reports/work
const getWorkReport = async (req, res, next) => {
  try {
    const data = await reportsRepository.getWorkReport(req.query);
    return successResponse(res, 'Work report fetched', data);
  } catch (error) { next(error); }
};

// GET /api/reports/employee-leads
const getEmployeeLeadsReport = async (req, res, next) => {
  try {
    const data = await reportsRepository.getEmployeeLeadsReport(req.query);
    return successResponse(res, 'Employee leads report fetched', data);
  } catch (error) { next(error); }
};

// GET /api/reports/lead-source
const getLeadSourceReport = async (req, res, next) => {
  try {
    const data = await reportsRepository.getLeadSourceReport(req.query);
    return successResponse(res, 'Lead source report fetched', data);
  } catch (error) { next(error); }
};

// GET /api/reports/all-leads
const getAllLeadsReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { leads, total } = await reportsRepository.getAllLeadsReport(req.query, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'All leads report fetched', leads, 200, pagination);
  } catch (error) { next(error); }
};

// POST /api/reports/export
const exportReport = async (req, res, next) => {
  try {
    const report = await reportsRepository.saveReport({
      ...req.body,
      exportedBy: req.user.id,
    });
    return successResponse(res, 'Report exported', report);
  } catch (error) { next(error); }
};

module.exports = { getWorkReport, getEmployeeLeadsReport, getLeadSourceReport, getAllLeadsReport, exportReport };
