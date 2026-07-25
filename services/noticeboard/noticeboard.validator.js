const { body, param, query } = require('express-validator');

const createNoticeRules = [
  body('notice').notEmpty().withMessage('Notice content is required'),
  body('fromDate').notEmpty().isISO8601().withMessage('Valid from date is required'),
  body('toDate').notEmpty().isISO8601().withMessage('Valid to date is required'),
  body('createdBy').notEmpty().withMessage('Creator name is required'),
  body('targetProfiles').optional().isArray(),
  body('targetEmployees').optional().isArray(),
];

const updateNoticeRules = [
  param('id').isMongoId().withMessage('Invalid notice ID'),
  body('notice').optional().isString(),
  body('fromDate').optional().isISO8601(),
  body('toDate').optional().isISO8601(),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid notice ID'),
];

const listRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
];

module.exports = { createNoticeRules, updateNoticeRules, idParamRule, listRules };
