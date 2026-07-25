const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, trim: true },
  password: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  fathersName: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  mobile: { type: String, trim: true }, // renamed from phone to mobile to match frontend
  role: { type: String, trim: true },
  profile: { type: String, trim: true }, // Changed from ObjectId to String to match frontend for now, or maybe the frontend should send ObjectId? Let's just allow both or keep String. Actually, frontend sends String.
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  ext: { type: String, trim: true },
  joiningDate: { type: Date },
  dob: { type: Date },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  allBranch: { type: String, trim: true },
  pastExperience: { type: String, trim: true },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  status: { type: String, default: 'Active' }, // added to support frontend string status
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Employee', employeeSchema);
