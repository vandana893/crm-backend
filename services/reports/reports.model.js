const mongoose = require('mongoose');

// Reports don't have their own collection — they aggregate from Leads and other collections
// This model is for saved/exported reports
const savedReportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ['work', 'employee-leads', 'lead-source', 'all-leads'],
      required: true,
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    exportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedReport', savedReportSchema);
