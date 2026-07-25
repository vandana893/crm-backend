const router = require('express').Router();
const controller = require('./dashboard.controller');
const { dataAccuracyRules, employeePerformanceRules } = require('./dashboard.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/kpis', auth, controller.getKpis);
router.get('/lead-balance', auth, controller.getLeadBalance);
router.get('/data-accuracy', auth, dataAccuracyRules, validate, controller.getDataAccuracy);
router.get('/employee-performance', auth, employeePerformanceRules, validate, controller.getEmployeePerformance);
router.get('/monthly-graph', auth, controller.getMonthlyGraph);

module.exports = router;
