const User = require('./auth.model');

const findByEmail = async (email) => {
  return User.findOne({ email }).select('+password');
};

const findById = async (id) => {
  return User.findById(id).populate('profileId departmentId');
};

const create = async (data) => {
  return User.create(data);
};

const findAll = async (filters = {}) => {
  return User.find(filters).populate('profileId departmentId').sort({ createdAt: -1 });
};

module.exports = { findByEmail, findById, create, findAll };
