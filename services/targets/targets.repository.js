const Target = require('./targets.model');

const findAll = async (filters = {}, pagination = {}) => {
  const query = {};
  if (filters.employee) query.employee = filters.employee;
  if (filters.targetType) query.targetType = filters.targetType;

  const total = await Target.countDocuments(query);
  const targets = await Target.find(query)
    .populate('employee', 'name role')
    .populate('createdBy', 'name')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ year: -1, month: -1 });

  return { targets, total };
};

const findById = async (id) => {
  return Target.findById(id).populate('employee', 'name role').populate('createdBy', 'name');
};

const create = async (data) => {
  return Target.create(data);
};

const updateById = async (id, data) => {
  return Target.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('employee', 'name role');
};

const deleteById = async (id) => {
  return Target.findByIdAndDelete(id);
};

const findMonthly = async (month, year) => {
  return Target.find({ month, year, targetType: 'monthly' }).populate('employee', 'name role');
};

const findFixed = async () => {
  return Target.find({ targetType: 'fixed' }).populate('employee', 'name role');
};

module.exports = { findAll, findById, create, updateById, deleteById, findMonthly, findFixed };
