const { body, param } = require('express-validator');

exports.sendMailRules = [
  body('to')
    .notEmpty().withMessage('At least one recipient (to) is required')
    .custom((value) => {
      // It can be a string or array
      if (Array.isArray(value) && value.length === 0) {
        throw new Error('At least one recipient is required');
      }
      return true;
    }),
  body('subject').notEmpty().withMessage('Subject is required')
];

exports.idParamRule = [
  param('id').isMongoId().withMessage('Invalid mail ID format'),
];
