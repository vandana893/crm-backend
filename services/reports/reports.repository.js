const Lead = require('../leads/leads.model');
const SavedReport = require('./reports.model');

const getWorkReport = async (filters = {}) => {
  const match = {};
  if (filters.leadSource) match.source = filters.leadSource;
  if (filters.leadResponse) match.response = filters.leadResponse;
  if (filters.fromDate && filters.toDate) {
    match.createdAt = { $gte: new Date(filters.fromDate), $lte: new Date(filters.toDate) };
  }

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$owner',
        fetched: { $sum: 1 },
        modified: { $sum: { $cond: [{ $ne: ['$response', 'New'] }, 1, 0] } },
        green: { $sum: { $cond: [{ $in: ['$response', ['Interested', 'Followup']] }, 1, 0] } },
        yellow: { $sum: { $cond: [{ $eq: ['$response', 'Call Back'] }, 1, 0] } },
        red: { $sum: { $cond: [{ $in: ['$response', ['Busy', 'Not Reachable', 'Switch Off', 'Not Interested']] }, 1, 0] } },
        white: { $sum: { $cond: [{ $eq: ['$response', 'New'] }, 1, 0] } },
        accActivate: { $sum: { $cond: [{ $eq: ['$response', 'Ac. Approved'] }, 1, 0] } },
      },
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } },
    { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
    { $sort: { fetched: -1 } },
  ]);
};

const getEmployeeLeadsReport = async (filters = {}) => {
  const match = {};
  if (filters.fromDate && filters.toDate) {
    match.createdAt = { $gte: new Date(filters.fromDate), $lte: new Date(filters.toDate) };
  }

  return Lead.aggregate([
    { $match: match },
    { $group: { _id: '$owner', totalLeads: { $sum: 1 }, responses: { $push: '$response' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'employee' } },
    { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
  ]);
};

const getLeadSourceReport = async (filters = {}) => {
  const match = {};
  if (filters.source) match.source = filters.source;
  if (filters.fromDate && filters.toDate) {
    match.createdAt = { $gte: new Date(filters.fromDate), $lte: new Date(filters.toDate) };
  }

  return Lead.aggregate([
    { $match: match },
    { $group: { _id: '$source', count: { $sum: 1 }, responses: { $push: '$response' } } },
    { $sort: { count: -1 } },
  ]);
};

const getAllLeadsReport = async (filters = {}, pagination = {}) => {
  const match = {};
  if (filters.fromDate && filters.toDate) {
    match.createdAt = { $gte: new Date(filters.fromDate), $lte: new Date(filters.toDate) };
  }

  const total = await Lead.countDocuments(match);
  const leads = await Lead.find(match)
    .populate('owner', 'name role')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ createdAt: -1 });

  return { leads, total };
};

const saveReport = async (data) => {
  return SavedReport.create(data);
};

module.exports = { getWorkReport, getEmployeeLeadsReport, getLeadSourceReport, getAllLeadsReport, saveReport };
