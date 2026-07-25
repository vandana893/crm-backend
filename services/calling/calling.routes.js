const router = require('express').Router();
const controller = require('./calling.controller');
const { callLogsRules, callActionRules, recordingIdRule } = require('./calling.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

router.get('/monitor', auth, controller.getMonitor);
router.get('/logs', auth, callLogsRules, validate, controller.getCallLogs);
router.get('/report', auth, controller.getCallingReport);
router.get('/recording/:id', auth, recordingIdRule, validate, controller.getRecording);
router.post('/action', auth, callActionRules, validate, controller.performAction);

module.exports = router;
