const { Agent, CallLog, CallingReport } = require('./calling.model');

const getActiveAgents = async () => {
  return Agent.find().populate('user', 'name role').sort({ name: 1 });
};

const getCallLogs = async (filters = {}, pagination = {}) => {
  const query = {};
  if (filters.source) query.source = filters.source;
  if (filters.employee) query.agentName = { $regex: filters.employee, $options: 'i' };
  if (filters.mobile) query.destination = { $regex: filters.mobile };
  if (filters.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filters.date);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const total = await CallLog.countDocuments(query);
  const logs = await CallLog.find(query)
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ date: -1 });

  return { logs, total };
};

const getCallingReport = async (filters = {}, pagination = {}) => {
  const query = {};
  if (filters.employee) query.name = { $regex: filters.employee, $options: 'i' };

  const total = await CallingReport.countDocuments(query);
  const reports = await CallingReport.find(query)
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ totalCalls: -1 });

  return { reports, total };
};

const getCallLogById = async (id) => {
  return CallLog.findById(id);
};

module.exports = { getActiveAgents, getCallLogs, getCallingReport, getCallLogById };
