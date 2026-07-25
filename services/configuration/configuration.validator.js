const { body, param } = require('express-validator');

const companyRules = [
  body('name').notEmpty().withMessage('Company name is required').trim(),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().isString(),
];

const brokerRules = [
  body('name').notEmpty().withMessage('Broker name is required').trim(),
  body('code').optional().isString().trim(),
  body('email').optional().isEmail(),
];

const templateRules = [
  body('name').notEmpty().withMessage('Template name is required').trim(),
  body('type').optional().isIn(['SMS', 'Email', 'WhatsApp']),
  body('content').notEmpty().withMessage('Template content is required'),
];

const leadResponseRules = [
  body('name').notEmpty().withMessage('Response name is required').trim(),
  body('colorCode').optional().isString(),
];

const leadStatusRules = [
  body('name').notEmpty().withMessage('Status name is required').trim(),
];

const leadSourceRules = [
  body('name').notEmpty().withMessage('Source name is required').trim(),
];

const departmentRules = [
  body('name').notEmpty().withMessage('Department name is required').trim(),
  body('head').optional().isString(),
];

const profileRules = [
  body('name').notEmpty().withMessage('Profile name is required').trim(),
];

const employeeRules = [
  body('name').notEmpty().withMessage('Employee name is required').trim(),
  body('email').optional().isEmail(),
  body('phone').optional().isString(),
  body('profile').optional().isString(),
  body('department').optional().isString(),
];

const teamRules = [
  body('name').notEmpty().withMessage('Team name is required').trim(),
  body('leader').optional().isString(),
  body('members').optional().isArray(),
];

const leadAllotRules = [
  body('leadIds').isArray({ min: 1 }).withMessage('At least one lead is required'),
  body('employeeId').notEmpty().isString().withMessage('Valid employee ID is required'),
];

const dealerAllotRules = [
  body('leadIds').isArray({ min: 1 }).withMessage('At least one lead is required'),
  body('dealerId').notEmpty().isString().withMessage('Valid dealer ID is required'),
];

const fetchLimitRules = [
  body('limits').isArray().withMessage('Limits array is required'),
];

const permissionRules = [
  body('profileId').notEmpty().isString().withMessage('Valid profile ID is required'),
  body('permissions').isObject().withMessage('Permissions object is required'),
];

const idParamRule = [
  param('id').isString().withMessage('Invalid ID'),
];

module.exports = {
  companyRules, brokerRules, templateRules, leadResponseRules,
  leadStatusRules, leadSourceRules, departmentRules, profileRules,
  employeeRules, teamRules, leadAllotRules, dealerAllotRules, fetchLimitRules,
  permissionRules, idParamRule,
};
