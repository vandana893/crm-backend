const Notice = require('./noticeboard.model');

const findAll = async (filters = {}, pagination = {}) => {
  const query = {};
  if (filters.search) {
    query.notice = { $regex: filters.search, $options: 'i' };
  }

  const total = await Notice.countDocuments(query);
  const notices = await Notice.find(query)
    .populate('createdByUser', 'name')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ createdAt: -1 });

  return { notices, total };
};

const findById = async (id) => {
  return Notice.findById(id).populate('createdByUser', 'name');
};

const create = async (data) => {
  return Notice.create(data);
};

const updateById = async (id, data) => {
  return Notice.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteById = async (id) => {
  return Notice.findByIdAndDelete(id);
};

module.exports = { findAll, findById, create, updateById, deleteById };
