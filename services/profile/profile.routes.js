const router = require('express').Router();
const controller = require('./profile.controller');
const { changePasswordRules, changeUserRules } = require('./profile.validator');
const validate = require('../../middleware/validate');
const { auth, authorize } = require('../../middleware/auth');

router.post('/change-user', auth, authorize('Admin'), changeUserRules, validate, controller.changeUser);
router.post('/change-password', auth, changePasswordRules, validate, controller.changePassword);
router.get('/me', auth, controller.getMyProfile);

module.exports = router;
