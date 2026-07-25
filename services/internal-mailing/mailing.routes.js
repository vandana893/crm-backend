const router = require('express').Router();
const controller = require('./mailing.controller');
const { composeRules, groupRules, folderRules, moveMailRules, idParamRule } = require('./mailing.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

// Mail routes — specific routes before parameterized
router.post('/compose', auth, composeRules, validate, controller.composeMail);
router.get('/inbox', auth, controller.getInbox);
router.get('/sent', auth, controller.getSent);

// Groups
router.get('/groups', auth, controller.getGroups);
router.post('/groups', auth, groupRules, validate, controller.createGroup);
router.put('/groups/:id', auth, idParamRule, validate, controller.updateGroup);
router.delete('/groups/:id', auth, idParamRule, validate, controller.deleteGroup);

// Folders
router.get('/folders', auth, controller.getFolders);
router.post('/folders', auth, folderRules, validate, controller.createFolder);

// Single mail operations
router.get('/:id', auth, idParamRule, validate, controller.getMailById);
router.delete('/:id', auth, idParamRule, validate, controller.deleteMail);
router.patch('/:id/move', auth, moveMailRules, validate, controller.moveMail);

module.exports = router;
