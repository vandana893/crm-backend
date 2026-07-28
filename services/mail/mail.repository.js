const Mail = require('./mail.model');

class MailRepository {
  async save(mailData) {
    const mail = new Mail(mailData);
    return await mail.save();
  }

  async findByQuery(query, options = { sort: { createdAt: -1 } }) {
    return await Mail.find(query).sort(options.sort).lean();
  }

  async findById(id) {
    return await Mail.findById(id).lean();
  }

  async updateById(id, updateData) {
    return await Mail.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Mail.findByIdAndDelete(id);
  }
}

module.exports = new MailRepository();
