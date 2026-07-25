const router = require('express').Router();
const multer = require('multer');
const controller = require('./leadUpload.controller');
const { csvUploadRules, pasteUploadRules } = require('./leadUpload.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/csv', auth, upload.single('file'), csvUploadRules, validate, controller.uploadCSV);
router.post('/paste', auth, pasteUploadRules, validate, controller.uploadPaste);
router.get('/template', auth, controller.downloadTemplate);

module.exports = router;
