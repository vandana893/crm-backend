const router = require('express').Router();
const controller = require('./leads.controller');
const { createLeadRules, updateLeadRules, updateCommentRules, updateResponseRules, getLeadsRules, idParamRule } = require('./leads.validator');
const validate = require('../../middleware/validate');
const { auth, authorize } = require('../../middleware/auth');

// Special routes MUST come before /:id to avoid conflict
router.get('/followup', auth, controller.getFollowups);
router.get('/disposed', auth, controller.getDisposed);
router.get('/repeat', auth, controller.getRepeat);
router.get('/hot', auth, controller.getHotLeads);
router.get('/fetchable', auth, controller.getFetchableLeads);
router.patch('/fetch/:id', auth, idParamRule, validate, controller.fetchLead);
router.post('/export', auth, controller.exportLeads);

// Standard CRUD
router.get('/', auth, getLeadsRules, validate, controller.getLeads);
router.get('/:id', auth, idParamRule, validate, controller.getLeadById);
router.post('/', auth, authorize('Admin'), createLeadRules, validate, controller.createLead);
router.put('/:id', auth, updateLeadRules, validate, controller.updateLead);
router.patch('/:id/comment', auth, updateCommentRules, validate, controller.updateComment);
router.patch('/:id/response', auth, updateResponseRules, validate, controller.updateLeadResponse);
router.delete('/:id', auth, idParamRule, validate, controller.deleteLead);

module.exports = router;
