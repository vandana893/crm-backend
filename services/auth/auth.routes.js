const router = require('express').Router();
const controller = require('./auth.controller');
const { loginRules, registerRules } = require('./auth.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.post('/login', loginRules, validate, controller.login);
router.post('/register', registerRules, validate, controller.register);
router.get('/me', auth, controller.getMe);
router.post('/logout', auth, controller.logout);

module.exports = router;
