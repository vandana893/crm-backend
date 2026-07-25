const { query } = require('express-validator');

const workReportRules = [
  query('leadSource').optional().isString(),
  query('leadResponse').optional().isString(),
  query('profile').optional().isString(),
  query('employee').optional().isString(),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
];

const employeeLeadsRules = [
  query('employee').optional().isString(),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

const leadSourceReportRules = [
  query('source').optional().isString(),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

const allLeadsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

module.exports = { workReportRules, employeeLeadsRules, leadSourceReportRules, allLeadsRules };
