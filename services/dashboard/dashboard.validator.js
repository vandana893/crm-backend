const { query } = require('express-validator');

const dataAccuracyRules = [
  query('leadSource').optional().isString(),
  query('modifyDate').optional().isString(),
  query('team').optional().isString(),
  query('fromDate').optional().isISO8601().withMessage('Invalid from date'),
  query('toDate').optional().isISO8601().withMessage('Invalid to date'),
];

const employeePerformanceRules = [
  query('employee').optional().isString(),
  query('team').optional().isString(),
];

module.exports = { dataAccuracyRules, employeePerformanceRules };
