const bcrypt = require('bcryptjs');
const profileRepository = require('./profile.repository');
const { generateToken } = require('../../config/jwt');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// POST /api/profile/change-user
const changeUser = async (req, res, next) => {
  try {
    const { userId, adminPassword } = req.body;

    // Verify admin password
    const admin = await profileRepository.findUserById(req.user.id);
    if (!admin) return errorResponse(res, 'Admin not found', 404);

    const isMatch = await admin.comparePassword(adminPassword);
    if (!isMatch) return errorResponse(res, 'Invalid admin password', 401);

    // Get target user and generate new token
    const targetUser = await profileRepository.findUserPublic(userId);
    if (!targetUser) return errorResponse(res, 'Target user not found', 404);

    const token = generateToken({ id: targetUser._id, role: targetUser.role, name: targetUser.name });

    return successResponse(res, 'User switched successfully', {
      token,
      user: { id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role },
    });
  } catch (error) { next(error); }
};

// POST /api/profile/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'New password and confirm password do not match', 400);
    }

    const user = await profileRepository.findUserById(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return errorResponse(res, 'Current password is incorrect', 401);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await profileRepository.updatePassword(req.user.id, hashedPassword);

    return successResponse(res, 'Password updated successfully');
  } catch (error) { next(error); }
};

// GET /api/profile/me
const getMyProfile = async (req, res, next) => {
  try {
    const user = await profileRepository.findUserPublic(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);

    return successResponse(res, 'Profile fetched', user);
  } catch (error) { next(error); }
};

module.exports = { changeUser, changePassword, getMyProfile };
