const mongoose = require('mongoose');

const graphConfigSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  profile: { type: String, required: true, trim: true },
  size: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
}, { timestamps: true });

// Transform output to match frontend expectations (using id instead of _id if needed, though _id works fine if frontend is updated to use _id)
graphConfigSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

module.exports = mongoose.model('GraphConfig', graphConfigSchema);
