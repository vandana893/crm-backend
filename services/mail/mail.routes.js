const router = require('express').Router();
const mailController = require('./mail.controller');
const { sendMailRules, idParamRule } = require('./mail.validator');
const validate = require('../../middleware/validate');
const { auth } = require('../../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
// (Ideally this should upload to Cloudinary/S3 as configured in the rest of the project, 
// but saving locally to an uploads folder is fine for standard SMTP attachments)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Mail routes
router.post('/send', auth, upload.array('attachments'), sendMailRules, validate, mailController.sendMail);
router.post('/draft', auth, upload.array('attachments'), mailController.draftMail);
router.get('/inbox', auth, mailController.getInbox);
router.get('/sent', auth, mailController.getSent);
router.get('/drafts', auth, mailController.getDrafts);

// Single mail operations
router.get('/:id', auth, idParamRule, validate, mailController.getMailById);
router.delete('/:id', auth, idParamRule, validate, mailController.deleteMail);

module.exports = router;
