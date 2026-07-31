const User = require('./auth.model');
const Employee = require('../configuration/models/employee.model');

const findByEmailOrUsername = async (identifier) => {
  let user = await User.findOne({ 
    $or: [
      { email: identifier },
      { name: identifier }
    ]
  }).select('+password');

  if (!user) {
    const employee = await Employee.findOne({ username: identifier });
    if (employee && employee.user) {
      user = await User.findById(employee.user).select('+password');
    }
  }

  return user;
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
