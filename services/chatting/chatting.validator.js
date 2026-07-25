const { body, param } = require('express-validator');

const sendMessageRules = [
  body('receiver').notEmpty().isMongoId().withMessage('Valid receiver ID is required'),
  body('text').notEmpty().withMessage('Message text is required'),
];

const broadcastRules = [
  body('text').notEmpty().withMessage('Broadcast message is required'),
  body('receivers').optional().isArray(),
];

const chatHistoryRules = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
];

module.exports = { sendMessageRules, broadcastRules, chatHistoryRules };
