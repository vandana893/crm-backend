const Company = require('./models/company.model');
const Broker = require('./models/broker.model');
const Template = require('./models/template.model');
const LeadResponse = require('./models/leadResponse.model');
const LeadStatus = require('./models/leadStatus.model');
const LeadSource = require('./models/leadSource.model');
const Department = require('./models/department.model');
const Profile = require('./models/profile.model');
const Employee = require('./models/employee.model');
const Team = require('./models/team.model');
const Lead = require('../leads/leads.model');

// ─── Generic CRUD Factory ───────────────────────────────────────────
const createCRUD = (Model, populateFields = '') => ({
  findAll: async (filters = {}) => Model.find(filters).populate(populateFields).sort({ createdAt: -1 }),
  findById: async (id) => Model.findById(id).populate(populateFields),
  create: async (data) => Model.create(data),
  updateById: async (id, data) => Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: async (id) => Model.findByIdAndDelete(id),
});

// ─── Per-entity Repositories ─────────────────────────────────────────
const company = {
  get: async () => Company.findOne(),
  update: async (data) => Company.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }),
};

const brokers = createCRUD(Broker);
const templates = createCRUD(Template, 'createdBy');
const leadResponses = createCRUD(LeadResponse);
const leadStatuses = createCRUD(LeadStatus);
const leadSources = createCRUD(LeadSource);
const departments = createCRUD(Department, 'head');
const profiles = createCRUD(Profile);
const employees = createCRUD(Employee, 'profile department team user');
const teams = createCRUD(Team, 'leader members department');

// ─── Special Operations ──────────────────────────────────────────────
const leadAllot = async (leadIds, employeeId) => {
  return Lead.updateMany({ _id: { $in: leadIds } }, { owner: employeeId });
};

const dealerAllot = async (leadIds, dealerId) => {
  return Lead.updateMany({ _id: { $in: leadIds } }, { dealer: dealerId });
};

const getFetchLimits = async () => {
  return Employee.find({ isActive: true }).select('name role fetchLimit').sort({ name: 1 });
};

const updateFetchLimits = async (limits) => {
  const operations = limits.map((l) => ({
    updateOne: {
      filter: { _id: l.employeeId },
      update: { fetchLimit: l.limit },
    },
  }));
  return Employee.bulkWrite(operations);
};

const leadRecycle = async (filters) => {
  return Lead.updateMany(filters, { response: 'New', owner: null });
};

const getPermissions = async (profileId) => {
  return Profile.findById(profileId).select('name permissions');
};

const updatePermissions = async (profileId, permissions) => {
  return Profile.findByIdAndUpdate(profileId, { permissions }, { new: true });
};

const getGraphSales = async () => {
  return Lead.aggregate([
    { $match: { response: { $in: ['Fund Added', 'Trade Done'] } } },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = {
  company, brokers, templates, leadResponses, leadStatuses, leadSources,
  departments, profiles, employees, teams,
  leadAllot, dealerAllot, getFetchLimits, updateFetchLimits,
  leadRecycle, getPermissions, updatePermissions, getGraphSales,
};
