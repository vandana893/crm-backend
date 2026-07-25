const { body, param } = require('express-validator');

const composeRules = [
  body('to').isArray({ min: 1 }).withMessage('At least one recipient is required'),
  body('subject').notEmpty().withMessage('Subject is required').trim(),
  body('body').notEmpty().withMessage('Mail body is required'),
  body('isUrgent').optional().isBoolean(),
];

const groupRules = [
  body('name').notEmpty().withMessage('Group name is required').trim(),
  body('members').isArray({ min: 1 }).withMessage('At least one member is required'),
];

const folderRules = [
  body('name').notEmpty().withMessage('Folder name is required').trim(),
  body('color').optional().isString(),
];

const moveMailRules = [
  param('id').isMongoId().withMessage('Invalid mail ID'),
  body('folder').notEmpty().withMessage('Folder name is required'),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid ID'),
];

module.exports = { composeRules, groupRules, folderRules, moveMailRules, idParamRule };
