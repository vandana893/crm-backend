const User = require('./auth.model');

const findByEmailOrUsername = async (identifier) => {
  return User.findOne({ 
    $or: [
      { email: identifier },
      { name: identifier }
    ]
  }).select('+password');
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

module.exports = { findByEmailOrUsername, findById, create, findAll };
