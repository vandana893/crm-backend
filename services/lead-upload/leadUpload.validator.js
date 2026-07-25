const { body } = require('express-validator');

const csvUploadRules = [
  body('source').notEmpty().withMessage('Lead source is required'),
  body('employee').notEmpty().isMongoId().withMessage('Valid employee ID is required'),
];

const pasteUploadRules = [
  body('source').notEmpty().withMessage('Lead source is required'),
  body('employee').notEmpty().isMongoId().withMessage('Valid employee ID is required'),
  body('mobileNumbers').notEmpty().withMessage('Mobile numbers are required'),
];

module.exports = { csvUploadRules, pasteUploadRules };
