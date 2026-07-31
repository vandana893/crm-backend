const router = require('express').Router();
const controller = require('./chatting.controller');
const { sendMessageRules, broadcastRules, chatHistoryRules } = require('./chatting.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/users/online', auth, controller.getOnlineUsers);
router.get('/users/offline', auth, controller.getOfflineUsers);
router.get('/messages/:userId', auth, chatHistoryRules, validate, controller.getChatHistory);
router.post('/messages', auth, sendMessageRules, validate, controller.sendMessage);
router.post('/broadcast', auth, broadcastRules, validate, controller.broadcastMessage);

module.exports = router;