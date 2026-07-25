const router = require('express').Router();
const controller = require('./targets.controller');
const { createTargetRules, updateTargetRules, getTargetsRules, idParamRule } = require('./targets.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/monthly', auth, controller.getMonthlyTargets);
router.get('/fixed', auth, controller.getFixedTargets);

router.get('/', auth, getTargetsRules, validate, controller.getTargets);
router.post('/', auth, createTargetRules, validate, controller.createTarget);
router.put('/:id', auth, updateTargetRules, validate, controller.updateTarget);
router.delete('/:id', auth, idParamRule, validate, controller.deleteTarget);

module.exports = router;
