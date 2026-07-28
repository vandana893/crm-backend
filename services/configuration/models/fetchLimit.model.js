const mongoose = require('mongoose');

const fetchLimitSchema = new mongoose.Schema({
  // Generic fields allowed via strict: false
}, { timestamps: true, strict: false });

module.exports = mongoose.model('FetchLimit', fetchLimitSchema);
