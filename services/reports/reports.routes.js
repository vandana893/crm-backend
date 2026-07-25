const router = require('express').Router();
const controller = require('./reports.controller');
const { workReportRules, employeeLeadsRules, leadSourceReportRules, allLeadsRules } = require('./reports.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/work', auth, workReportRules, validate, controller.getWorkReport);
router.get('/employee-leads', auth, employeeLeadsRules, validate, controller.getEmployeeLeadsReport);
router.get('/lead-source', auth, leadSourceReportRules, validate, controller.getLeadSourceReport);
router.get('/all-leads', auth, allLeadsRules, validate, controller.getAllLeadsReport);
router.post('/export', auth, controller.exportReport);

module.exports = router;
