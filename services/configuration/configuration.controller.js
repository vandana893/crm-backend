const repo = require('./configuration.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');

// ─── Generic CRUD Handler Factory ────────────────────────────────────
const makeCRUDHandlers = (entityRepo, entityName) => ({
  getAll: async (req, res, next) => {
    try {
      const items = await entityRepo.findAll();
      return successResponse(res, `${entityName} list fetched`, items);
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const item = await entityRepo.findById(req.params.id);
      if (!item) return errorResponse(res, `${entityName} not found`, 404);
      return successResponse(res, `${entityName} fetched`, item);
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const item = await entityRepo.create(req.body);
      return createdResponse(res, `${entityName} created`, item);
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const item = await entityRepo.updateById(req.params.id, req.body);
      if (!item) return errorResponse(res, `${entityName} not found`, 404);
      return successResponse(res, `${entityName} updated`, item);
    } catch (error) { next(error); }
  },
  remove: async (req, res, next) => {
    try {
      const item = await entityRepo.deleteById(req.params.id);
      if (!item) return errorResponse(res, `${entityName} not found`, 404);
      return successResponse(res, `${entityName} deleted`);
    } catch (error) { next(error); }
  },
});

// ─── Entity Handlers ──────────────────────────────────────────────────
const brokerHandlers      = makeCRUDHandlers(repo.brokers, 'Broker');
const templateHandlers    = makeCRUDHandlers(repo.templates, 'Template');
const leadResponseHandlers = makeCRUDHandlers(repo.leadResponses, 'Lead Response');
const leadStatusHandlers  = makeCRUDHandlers(repo.leadStatuses, 'Lead Status');
const leadSourceHandlers  = makeCRUDHandlers(repo.leadSources, 'Lead Source');
const departmentHandlers  = makeCRUDHandlers(repo.departments, 'Department');
const profileHandlers     = makeCRUDHandlers(repo.profiles, 'Profile');
const employeeHandlers    = makeCRUDHandlers(repo.employees, 'Employee');
const teamHandlers        = makeCRUDHandlers(repo.teams, 'Team');
const fetchLimitHandlers  = makeCRUDHandlers(repo.fetchLimits, 'Fetch Limit');

// ─── Company (single entity) ─────────────────────────────────────────
const getCompany = async (req, res, next) => {
  try {
    const company = await repo.company.get();
    return successResponse(res, 'Company fetched', company);
  } catch (error) { next(error); }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await repo.company.update(req.body);
    return successResponse(res, 'Company updated', company);
  } catch (error) { next(error); }
};

// ─── Special Operations ──────────────────────────────────────────────
const allotLeads = async (req, res, next) => {
  try {
    const result = await repo.leadAllot(req.body);
    return successResponse(res, 'Leads allotted successfully', { modified: result.modifiedCount });
  } catch (error) { next(error); }
};

const allotDealers = async (req, res, next) => {
  try {
    const result = await repo.dealerAllot(req.body);
    return successResponse(res, 'Dealers allotted successfully', { modified: result.modifiedCount });
  } catch (error) { next(error); }
};

const getFetchLimit = async (req, res, next) => {
  try {
    const data = await repo.getFetchLimits();
    return successResponse(res, 'Fetch limits fetched', data);
  } catch (error) { next(error); }
};

const updateFetchLimit = async (req, res, next) => {
  try {
    await repo.updateFetchLimits(req.body.limits);
    return successResponse(res, 'Fetch limits updated');
  } catch (error) { next(error); }
};

const recycleLeads = async (req, res, next) => {
  try {
    const result = await repo.leadRecycle(req.body.filters || {});
    return successResponse(res, 'Leads recycled', { modified: result.modifiedCount });
  } catch (error) { next(error); }
};

const getPermissions = async (req, res, next) => {
  try {
    const data = await repo.getPermissions(req.query.profileId);
    return successResponse(res, 'Permissions fetched', data);
  } catch (error) { next(error); }
};

const updatePermissions = async (req, res, next) => {
  try {
    const data = await repo.updatePermissions(req.body.profileId, req.body.permissions);
    return successResponse(res, 'Permissions updated', data);
  } catch (error) { next(error); }
};

const getGraphSales = async (req, res, next) => {
  try {
    const data = await repo.getGraphSales();
    return successResponse(res, 'Graph sales data fetched', data);
  } catch (error) { next(error); }
};

module.exports = {
  getCompany, updateCompany,
  brokerHandlers, templateHandlers, leadResponseHandlers, leadStatusHandlers,
  leadSourceHandlers, departmentHandlers, profileHandlers, employeeHandlers, teamHandlers, fetchLimitHandlers,
  allotLeads, allotDealers, getFetchLimit, updateFetchLimit,
  recycleLeads, leadRecycleRulesHandlers: makeCRUDHandlers(repo.leadRecycleRules, 'Lead Recycle Rule'), getPermissions, updatePermissions, getGraphSales,
};
