const leadsRepository = require('./leads.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');

// GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filters = {};

    if (req.query.response) filters.response = req.query.response;
    if (req.query.source) filters.source = req.query.source;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.owner) filters.owner = req.query.owner;
    if (req.query.mobile) filters.mobile = { $regex: req.query.mobile, $options: 'i' };
    if (req.query.fromDate && req.query.toDate) {
      filters.createdAt = { $gte: new Date(req.query.fromDate), $lte: new Date(req.query.toDate) };
    }

    if (req.user && req.user.role !== 'Admin') {
      filters.owner = req.user.id;
    }

    const { leads, total } = await leadsRepository.findAll(filters, { skip, limit });
    const pagination = getPaginationMeta(page, limit, total);

    return successResponse(res, 'Leads fetched successfully', leads, 200, pagination);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/:id
const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadsRepository.findById(req.params.id);
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    if (req.user && req.user.role !== 'Admin') {
      const ownerId = lead.owner?._id ? lead.owner._id.toString() : lead.owner?.toString();
      if (ownerId !== req.user.id) return errorResponse(res, 'Access denied', 403);
    }

    return successResponse(res, 'Lead fetched', lead);
  } catch (error) {
    next(error);
  }
};

// POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const lead = await leadsRepository.create(req.body);
    return createdResponse(res, 'Lead created successfully', lead);
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    const existingLead = await leadsRepository.findById(req.params.id);
    if (!existingLead) return errorResponse(res, 'Lead not found', 404);

    if (req.user && req.user.role !== 'Admin') {
      const ownerId = existingLead.owner?._id ? existingLead.owner._id.toString() : existingLead.owner?.toString();
      if (ownerId !== req.user.id) return errorResponse(res, 'Access denied', 403);
    }

    const lead = await leadsRepository.updateById(req.params.id, req.body);

    return successResponse(res, 'Lead updated successfully', lead);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/leads/:id/comment
const updateComment = async (req, res, next) => {
  try {
    const existingLead = await leadsRepository.findById(req.params.id);
    if (!existingLead) return errorResponse(res, 'Lead not found', 404);

    if (req.user && req.user.role !== 'Admin') {
      const ownerId = existingLead.owner?._id ? existingLead.owner._id.toString() : existingLead.owner?.toString();
      if (ownerId !== req.user.id) return errorResponse(res, 'Access denied', 403);
    }

    const lead = await leadsRepository.updateComment(req.params.id, req.body.comment);

    return successResponse(res, 'Comment updated', lead);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/leads/:id/response
const updateLeadResponse = async (req, res, next) => {
  try {
    const existingLead = await leadsRepository.findById(req.params.id);
    if (!existingLead) return errorResponse(res, 'Lead not found', 404);

    if (req.user && req.user.role !== 'Admin') {
      const ownerId = existingLead.owner?._id ? existingLead.owner._id.toString() : existingLead.owner?.toString();
      if (ownerId !== req.user.id) return errorResponse(res, 'Access denied', 403);
    }

    const lead = await leadsRepository.updateResponse(req.params.id, req.body.response);

    return successResponse(res, 'Response updated', lead);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res, next) => {
  try {
    const existingLead = await leadsRepository.findById(req.params.id);
    if (!existingLead) return errorResponse(res, 'Lead not found', 404);

    if (req.user && req.user.role !== 'Admin') {
      const ownerId = existingLead.owner?._id ? existingLead.owner._id.toString() : existingLead.owner?.toString();
      if (ownerId !== req.user.id) return errorResponse(res, 'Access denied', 403);
    }

    const lead = await leadsRepository.deleteById(req.params.id);

    return successResponse(res, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/followup
const getFollowups = async (req, res, next) => {
  try {
    const ownerId = req.user && req.user.role !== 'Admin' ? req.user.id : null;
    const leads = await leadsRepository.findFollowups(ownerId);
    return successResponse(res, 'Follow-up leads fetched', leads);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/disposed
const getDisposed = async (req, res, next) => {
  try {
    const ownerId = req.user && req.user.role !== 'Admin' ? req.user.id : null;
    const leads = await leadsRepository.findDisposed(ownerId);
    return successResponse(res, 'Disposed leads fetched', leads);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/repeat
const getRepeat = async (req, res, next) => {
  try {
    const ownerId = req.user && req.user.role !== 'Admin' ? req.user.id : null;
    const leads = await leadsRepository.findRepeat(ownerId);
    return successResponse(res, 'Repeat leads fetched', leads);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/hot
const getHotLeads = async (req, res, next) => {
  try {
    const ownerId = req.user && req.user.role !== 'Admin' ? req.user.id : null;
    const leads = await leadsRepository.findHotLeads(ownerId);
    return successResponse(res, 'Hot leads fetched', leads);
  } catch (error) {
    next(error);
  }
};

// POST /api/leads/export
const exportLeads = async (req, res, next) => {
  try {
    const filters = req.body || {};
    if (req.user && req.user.role !== 'Admin') {
      filters.owner = req.user.id;
    }
    const leads = await leadsRepository.findByFilters(filters);
    return successResponse(res, 'Leads exported', leads);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/fetchable
const getFetchableLeads = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const userId = req.user ? req.user.id : null;
    const leads = await leadsRepository.findFetchable(limit, userId);
    return successResponse(res, 'Fetchable leads retrieved successfully', leads);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/leads/fetch/:id
const fetchLead = async (req, res, next) => {
  try {
    if (!req.user || req.user.role === 'Admin') {
      return errorResponse(res, 'Only employees can fetch leads', 403);
    }

    const leadId = req.params.id;
    const userId = req.user.id;

    // Use atomic update to assign the lead
    // If the lead was already assigned, this query will return null
    const lead = await leadsRepository.assignLeadToUser(leadId, userId);

    if (!lead) {
      return errorResponse(res, 'Lead is no longer available or not found', 409);
    }

    return successResponse(res, 'Lead fetched successfully', lead);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads, getLeadById, createLead, updateLead,
  updateComment, updateLeadResponse, deleteLead,
  getFollowups, getDisposed, getRepeat, getHotLeads, exportLeads,
  getFetchableLeads, fetchLead,
};
