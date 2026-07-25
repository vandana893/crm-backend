const callingRepository = require('./calling.repository');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// GET /api/calling/monitor
const getMonitor = async (req, res, next) => {
  try {
    const agents = await callingRepository.getActiveAgents();
    return successResponse(res, 'Active agents fetched', agents);
  } catch (error) {
    next(error);
  }
};

// GET /api/calling/logs
const getCallLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { logs, total } = await callingRepository.getCallLogs(req.query, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'Call logs fetched', logs, 200, pagination);
  } catch (error) {
    next(error);
  }
};

// GET /api/calling/report
const getCallingReport = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { reports, total } = await callingRepository.getCallingReport(req.query, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'Calling report fetched', reports, 200, pagination);
  } catch (error) {
    next(error);
  }
};

// GET /api/calling/recording/:id
const getRecording = async (req, res, next) => {
  try {
    const callLog = await callingRepository.getCallLogById(req.params.id);
    if (!callLog) return errorResponse(res, 'Recording not found', 404);

    return successResponse(res, 'Recording URL fetched', { recordingUrl: callLog.recordingUrl || null });
  } catch (error) {
    next(error);
  }
};

// POST /api/calling/action
const performAction = async (req, res, next) => {
  try {
    const { agentId, mode } = req.body;
    return successResponse(res, `${mode} mode activated for agent`, { agentId, mode, status: 'active' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMonitor, getCallLogs, getCallingReport, getRecording, performAction };
