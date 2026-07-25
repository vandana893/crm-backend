const router = require('express').Router();
const controller = require('./noticeboard.controller');
const { createNoticeRules, updateNoticeRules, idParamRule, listRules } = require('./noticeboard.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/', auth, listRules, validate, controller.getNotices);
router.post('/', auth, createNoticeRules, validate, controller.createNotice);
router.put('/:id', auth, updateNoticeRules, validate, controller.updateNotice);
router.delete('/:id', auth, idParamRule, validate, controller.deleteNotice);

module.exports = router;
