const nodemailer = require('nodemailer');
const mailRepository = require('./mail.repository');

class MailService {
  constructor() {
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
    console.log("SMTP_USER:", process.env.SMTP_USER);

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.transporter.verify(function (error, success) {
      if (error) {
        console.error('SMTP Connection Error:', error);
      } else {
        console.log('SMTP Server is ready to take our messages');
      }
    });
  }

  async sendMail(userId, mailData) {
    const { from, to, cc, bcc, subject, htmlBody, plainTextBody, attachments } = mailData;
    
    // Parse the recipients arrays from strings if needed (frontend can send them as arrays or comma separated strings)
    const toArray = Array.isArray(to) ? to : (to || '').split(',').map(e => e.trim()).filter(Boolean);
    const ccArray = Array.isArray(cc) ? cc : (cc || '').split(',').map(e => e.trim()).filter(Boolean);
    const bccArray = Array.isArray(bcc) ? bcc : (bcc || '').split(',').map(e => e.trim()).filter(Boolean);

    // Prepare attachments for Nodemailer
    const mailAttachments = (attachments || []).map(file => ({
      filename: file.filename || file.originalname,
      path: file.path,
    }));

    const mailOptions = {
      from: from || process.env.SMTP_USER,
      to: toArray.join(', '),
      cc: ccArray.join(', '),
      bcc: bccArray.join(', '),
      subject: subject,
      text: plainTextBody,
      html: htmlBody || plainTextBody,
      attachments: mailAttachments
    };

    try {
      console.log(`[MailService] Attempting to send email from ${mailOptions.from} to ${mailOptions.to}`);
      // Send mail with defined transport object
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MailService] Email sent successfully. Message ID: ${info.messageId}`);
      
      // Save sent mail to Database
      const savedMail = await mailRepository.save({
        user: userId,
        from: mailOptions.from,
        to: toArray,
        cc: ccArray,
        bcc: bccArray,
        subject: subject,
        htmlBody: mailOptions.html,
        plainTextBody: mailOptions.text,
        attachments: (attachments || []).map(a => ({
          filename: a.filename || a.originalname,
          path: a.path,
          size: a.size,
          mimetype: a.mimetype
        })),
        status: 'sent',
        deliveryStatus: 'delivered',
      });

      console.log(`[MailService] Saved mail record to database with ID: ${savedMail._id}`);
      return { success: true, message: 'Message sent successfully', messageId: info.messageId, mail: savedMail };
    } catch (error) {
      console.error('[MailService] Failed to send email:', error);
      // Still attempt to save it as failed if something went wrong
      try {
        await mailRepository.save({
          user: userId,
          from: mailOptions.from,
          to: toArray,
          cc: ccArray,
          bcc: bccArray,
          subject: subject,
          htmlBody: mailOptions.html,
          plainTextBody: mailOptions.text,
          status: 'failed',
          deliveryStatus: 'failed',
          errorMessage: error.message
        });
        console.log('[MailService] Saved failed mail record to database');
      } catch (saveError) {
         console.error('[MailService] Failed to save failed mail record:', saveError);
      }
      throw error;
    }
  }

  async saveDraft(userId, mailData) {
    const { from, to, cc, bcc, subject, htmlBody, plainTextBody, attachments } = mailData;
    const toArray = Array.isArray(to) ? to : (to || '').split(',').map(e => e.trim()).filter(Boolean);
    const ccArray = Array.isArray(cc) ? cc : (cc || '').split(',').map(e => e.trim()).filter(Boolean);
    const bccArray = Array.isArray(bcc) ? bcc : (bcc || '').split(',').map(e => e.trim()).filter(Boolean);

    const savedDraft = await mailRepository.save({
      user: userId,
      from: from || process.env.SMTP_USER,
      to: toArray,
      cc: ccArray,
      bcc: bccArray,
      subject: subject,
      htmlBody: htmlBody,
      plainTextBody: plainTextBody,
      attachments: (attachments || []).map(a => ({
        filename: a.filename || a.originalname,
        path: a.path,
        size: a.size,
        mimetype: a.mimetype
      })),
      status: 'draft',
      deliveryStatus: 'pending',
    });

    return { success: true, message: 'Draft saved successfully', mail: savedDraft };
  }

  async getSent(userId) {
    return await mailRepository.findByQuery({ user: userId, status: 'sent' });
  }

  async getDrafts(userId) {
    return await mailRepository.findByQuery({ user: userId, status: 'draft' });
  }

  // A mock inbox (emails sent to this user)
  async getInbox(userEmail) {
    // If the CRM user's email matches 'to', 'cc', or 'bcc'
    return await mailRepository.findByQuery({
      $or: [
        { to: userEmail },
        { cc: userEmail },
        { bcc: userEmail }
      ],
      status: 'sent' // only sent emails appear in someone else's inbox
    });
  }
}

module.exports = new MailService();
