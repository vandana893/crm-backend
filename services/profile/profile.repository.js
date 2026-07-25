const User = require('../auth/auth.model');
const UserPreference = require('./profile.model');

const findUserById = async (id) => {
  return User.findById(id).select('+password');
};

const findUserPublic = async (id) => {
  return User.findById(id).populate('profileId departmentId');
};

const updatePassword = async (id, hashedPassword) => {
  return User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
};

const getPreferences = async (userId) => {
  return UserPreference.findOne({ user: userId });
};

const updatePreferences = async (userId, data) => {
  return UserPreference.findOneAndUpdate(
    { user: userId },
    { ...data, user: userId },
    { upsert: true, new: true }
  );
};

module.exports = { findUserById, findUserPublic, updatePassword, getPreferences, updatePreferences };
