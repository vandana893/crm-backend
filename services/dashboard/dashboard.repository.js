const KpiSnapshot = require('./dashboard.model');
const Lead = require('../leads/leads.model');

const getKpis = async (userId) => {
  return KpiSnapshot.findOne({ userId }).sort({ date: -1 });
};

const getLeadBalance = async () => {
  return Lead.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $project: { source: '$_id', count: 1, _id: 0 } },
  ]);
};

const getDataAccuracy = async (filters = {}) => {
  const match = {};
  if (filters.leadSource) match.source = filters.leadSource;
  if (filters.fromDate && filters.toDate) {
    match.createdAt = { $gte: new Date(filters.fromDate), $lte: new Date(filters.toDate) };
  }

  return Lead.aggregate([
    { $match: match },
    { $group: { _id: '$response', count: { $sum: 1 } } },
    { $project: { data: '$_id', count: 1, _id: 0 } },
  ]);
};

const getEmployeePerformance = async (filters = {}) => {
  const match = {};
  if (filters.employee) match.owner = filters.employee;

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$owner',
        account: { $sum: 1 },
        funded: { $sum: { $cond: [{ $eq: ['$response', 'Fund Added'] }, 1, 0] } },
        fund: { $sum: { $cond: [{ $eq: ['$response', 'Fund Pending'] }, 1, 0] } },
      },
    },
    {
      $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employeeInfo' },
    },
  ]);
};

const getMonthlyGraph = async () => {
  return Lead.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = { getKpis, getLeadBalance, getDataAccuracy, getEmployeePerformance, getMonthlyGraph };
