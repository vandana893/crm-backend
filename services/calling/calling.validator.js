const { query, param, body } = require('express-validator');

const callLogsRules = [
  query('source').optional().isString(),
  query('employee').optional().isString(),
  query('mobile').optional().isString(),
  query('date').optional().isISO8601().withMessage('Invalid date format'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const callActionRules = [
  body('agentId').notEmpty().isMongoId().withMessage('Valid agent ID is required'),
  body('mode').notEmpty().isIn(['Listen', 'Whisper', 'Barge']).withMessage('Mode must be Listen, Whisper, or Barge'),
];

const recordingIdRule = [
  param('id').isMongoId().withMessage('Invalid recording ID'),
];

module.exports = { callLogsRules, callActionRules, recordingIdRule };
