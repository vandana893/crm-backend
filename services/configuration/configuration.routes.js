const router = require('express').Router();
const ctrl = require('./configuration.controller');
const v = require('./configuration.validator');
const validate = require('../../middleware/validate');
const { auth, authorize } = require('../../middleware/auth');

// ─── Company ─────────────────────────────────────────────────────────
router.get('/company', auth, ctrl.getCompany);
router.put('/company', auth, v.companyRules, validate, ctrl.updateCompany);

// ─── CRUD Macro ──────────────────────────────────────────────────────
const registerCRUD = (path, handlers, rules) => {
  router.get(path, auth, handlers.getAll);
  router.get(`${path}/:id`, auth, v.idParamRule, validate, handlers.getById);
  router.post(path, auth, rules, validate, handlers.create);
  router.put(`${path}/:id`, auth, v.idParamRule, validate, handlers.update);
  router.delete(`${path}/:id`, auth, v.idParamRule, validate, handlers.remove);
};

registerCRUD('/brokers', ctrl.brokerHandlers, v.brokerRules);
registerCRUD('/templates', ctrl.templateHandlers, v.templateRules);
registerCRUD('/lead-responses', ctrl.leadResponseHandlers, v.leadResponseRules);
registerCRUD('/lead-statuses', ctrl.leadStatusHandlers, v.leadStatusRules);
registerCRUD('/lead-sources', ctrl.leadSourceHandlers, v.leadSourceRules);
registerCRUD('/departments', ctrl.departmentHandlers, v.departmentRules);
registerCRUD('/profiles', ctrl.profileHandlers, v.profileRules);
registerCRUD('/employees', ctrl.employeeHandlers, v.employeeRules);
registerCRUD('/teams', ctrl.teamHandlers, v.teamRules);

// ─── Special Operations ──────────────────────────────────────────────
router.post('/lead-allot', auth, v.leadAllotRules, validate, ctrl.allotLeads);
router.post('/dealer-allot', auth, v.dealerAllotRules, validate, ctrl.allotDealers);
router.get('/fetch-limit', auth, ctrl.getFetchLimit);
router.put('/fetch-limit', auth, v.fetchLimitRules, validate, ctrl.updateFetchLimit);
router.post('/lead-recycle', auth, ctrl.recycleLeads);
router.get('/permissions', auth, ctrl.getPermissions);
router.put('/permissions', auth, v.permissionRules, validate, ctrl.updatePermissions);
router.get('/graph-sales', auth, ctrl.getGraphSales);

module.exports = router;
