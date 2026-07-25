const dashboardRepository = require('./dashboard.repository');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// GET /api/dashboard/kpis
const getKpis = async (req, res, next) => {
  try {
    const kpis = await dashboardRepository.getKpis(req.user.id);
    return successResponse(res, 'KPIs fetched', kpis);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/lead-balance
const getLeadBalance = async (req, res, next) => {
  try {
    const data = await dashboardRepository.getLeadBalance();
    return successResponse(res, 'Lead balance fetched', data);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/data-accuracy
const getDataAccuracy = async (req, res, next) => {
  try {
    const data = await dashboardRepository.getDataAccuracy(req.query);
    return successResponse(res, 'Data accuracy report fetched', data);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/employee-performance
const getEmployeePerformance = async (req, res, next) => {
  try {
    const data = await dashboardRepository.getEmployeePerformance(req.query);
    return successResponse(res, 'Employee performance fetched', data);
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/monthly-graph
const getMonthlyGraph = async (req, res, next) => {
  try {
    const data = await dashboardRepository.getMonthlyGraph();
    return successResponse(res, 'Monthly graph data fetched', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getKpis, getLeadBalance, getDataAccuracy, getEmployeePerformance, getMonthlyGraph };
