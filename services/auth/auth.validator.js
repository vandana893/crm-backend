const { body } = require('express-validator');

const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerRules = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['Admin', 'SBA', 'TL', 'ARM', 'Manager'])
    .withMessage('Invalid role'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Invalid phone number'),
];

module.exports = { loginRules, registerRules };
