const LeadUploadBatch = require('./leadUpload.model');
const Lead = require('../leads/leads.model');

const createBatch = async (data) => {
  return LeadUploadBatch.create(data);
};

const updateBatch = async (id, data) => {
  return LeadUploadBatch.findByIdAndUpdate(id, data, { new: true });
};

const bulkCreateLeads = async (leads) => {
  return Lead.insertMany(leads, { ordered: false });
};

const findBatchById = async (id) => {
  return LeadUploadBatch.findById(id).populate('employee uploadedBy', 'name');
};

module.exports = { createBatch, updateBatch, bulkCreateLeads, findBatchById };
