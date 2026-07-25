const { body } = require('express-validator');

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
];

const changeUserRules = [
  body('userId').notEmpty().isMongoId().withMessage('Valid user ID is required'),
  body('adminPassword').notEmpty().withMessage('Admin password is required'),
];

module.exports = { changePasswordRules, changeUserRules };
