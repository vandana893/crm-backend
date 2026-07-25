const { body, query, param } = require('express-validator');

const createLeadRules = [
  body('owner').notEmpty().isMongoId().withMessage('Valid owner ID is required'),
  body('mobile').notEmpty().withMessage('Mobile number is required'),
  body('source').notEmpty().isIn(['Premium Lead', 'HNI Lead', 'Web Lead', 'Fresh Lead', 'SEO', 'Pipeline', 'Fresh']).withMessage('Invalid lead source'),
  body('response').optional().isIn(['New', 'Call Back', 'Interested', 'Busy', 'Not Reachable', 'Switch Off', 'Not Interested', 'Followup', 'Ac. Process', 'Ac. Denied', 'Ac. Approved', 'Fund Pending', 'Fund Added', 'Trade Done', 'Disposed']).withMessage('Invalid response'),
  body('type').optional().isIn(['Normal', 'Hot', 'Instant']).withMessage('Invalid lead type'),
  body('clientName').optional().trim(),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('investment').optional().isIn(['Below 50k', '50k to 1 lac', '1 lac to 5 lac', '5 lac to 10 lac', '10 lac +', '']),
  body('callbackDate').optional().isISO8601().withMessage('Invalid callback date'),
];

const updateLeadRules = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('response').optional().isIn(['New', 'Call Back', 'Interested', 'Busy', 'Not Reachable', 'Switch Off', 'Not Interested', 'Followup', 'Ac. Process', 'Ac. Denied', 'Ac. Approved', 'Fund Pending', 'Fund Added', 'Trade Done', 'Disposed']),
  body('type').optional().isIn(['Normal', 'Hot', 'Instant']),
  body('email').optional().isEmail(),
];

const updateCommentRules = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('comment').notEmpty().isString().withMessage('Comment is required'),
];

const updateResponseRules = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('response').notEmpty().isIn(['New', 'Call Back', 'Interested', 'Busy', 'Not Reachable', 'Switch Off', 'Not Interested', 'Followup', 'Ac. Process', 'Ac. Denied', 'Ac. Approved', 'Fund Pending', 'Fund Added', 'Trade Done', 'Disposed']).withMessage('Invalid response'),
];

const getLeadsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('response').optional().isString(),
  query('source').optional().isString(),
  query('type').optional().isString(),
  query('owner').optional().isMongoId(),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
];

module.exports = { createLeadRules, updateLeadRules, updateCommentRules, updateResponseRules, getLeadsRules, idParamRule };
