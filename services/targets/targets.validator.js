const { body, query, param } = require('express-validator');

const createTargetRules = [
  body('employee').notEmpty().isMongoId().withMessage('Valid employee ID is required'),
  body('acTarget').optional().isNumeric().withMessage('Account target must be a number'),
  body('fundedAcTarget').optional().isNumeric().withMessage('Funded account target must be a number'),
  body('fundMarginTarget').optional().isNumeric().withMessage('Fund margin target must be a number'),
  body('brokerageTarget').optional().isNumeric().withMessage('Brokerage target must be a number'),
  body('month').notEmpty().isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
  body('year').notEmpty().isInt({ min: 2020 }).withMessage('Invalid year'),
  body('targetType').optional().isIn(['monthly', 'fixed']).withMessage('Target type must be monthly or fixed'),
];

const updateTargetRules = [
  param('id').isMongoId().withMessage('Invalid target ID'),
  body('acTarget').optional().isNumeric(),
  body('fundedAcTarget').optional().isNumeric(),
  body('fundMarginTarget').optional().isNumeric(),
  body('brokerageTarget').optional().isNumeric(),
];

const getTargetsRules = [
  query('profile').optional().isString(),
  query('employee').optional().isMongoId(),
  query('team').optional().isString(),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid target ID'),
];

module.exports = { createTargetRules, updateTargetRules, getTargetsRules, idParamRule };
