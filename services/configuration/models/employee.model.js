const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  password: { type: String, trim: true, ref: 'employee' },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  role: { type: String, trim: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  ext: { type: String, trim: true },
  joiningDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
