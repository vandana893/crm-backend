const leadUploadRepository = require('./leadUpload.repository');
const { parseCSV } = require('../../utils/csvParser');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');

// POST /api/lead-upload/csv
const uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'CSV file is required', 400);
    }

    const { source, employee } = req.body;
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parseCSV(csvContent, req.body.columnMapping || {});

    const batch = await leadUploadRepository.createBatch({
      source,
      employee,
      uploadType: 'csv',
      totalRecords: records.length,
      uploadedBy: req.user.id,
    });

    const leads = records.map((record) => ({
      owner: employee,
      clientName: record.name || '',
      mobile: record.mobile || '',
      email: record.email || '',
      city: record.city || '',
      address: record.address || '',
      segment: record.segment || '',
      source,
      response: 'New',
    }));

    const result = await leadUploadRepository.bulkCreateLeads(leads);

    await leadUploadRepository.updateBatch(batch._id, {
      successCount: result.length,
      failedCount: records.length - result.length,
      status: 'completed',
    });

    return createdResponse(res, 'CSV leads uploaded successfully', {
      batchId: batch._id,
      total: records.length,
      success: result.length,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/lead-upload/paste
const uploadPaste = async (req, res, next) => {
  try {
    const { source, employee, mobileNumbers } = req.body;

    const mobiles = mobileNumbers
      .split(/[\n,;]+/)
      .map((m) => m.trim())
      .filter((m) => m.length >= 10);

    if (mobiles.length === 0) {
      return errorResponse(res, 'No valid mobile numbers found', 400);
    }

    const batch = await leadUploadRepository.createBatch({
      source,
      employee,
      uploadType: 'paste',
      totalRecords: mobiles.length,
      uploadedBy: req.user.id,
    });

    const leads = mobiles.map((mobile) => ({
      owner: employee,
      mobile,
      source,
      response: 'New',
    }));

    const result = await leadUploadRepository.bulkCreateLeads(leads);

    await leadUploadRepository.updateBatch(batch._id, {
      successCount: result.length,
      failedCount: mobiles.length - result.length,
      status: 'completed',
    });

    return createdResponse(res, 'Pasted leads uploaded successfully', {
      batchId: batch._id,
      total: mobiles.length,
      success: result.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/lead-upload/template
const downloadTemplate = async (req, res, next) => {
  try {
    const csvTemplate = 'mobile,name,email,city,address,segment\n9876543210,John Doe,john@example.com,Mumbai,Address Here,Equity';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=lead_upload_template.csv');
    return res.send(csvTemplate);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadCSV, uploadPaste, downloadTemplate };
