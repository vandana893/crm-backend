const authRepository = require('./auth.repository');
const { generateToken } = require('../../config/jwt');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authRepository.findByEmailOrUsername(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken({ id: user._id, role: user.role, name: user.name });

    return successResponse(res, 'Login successful', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const user = await authRepository.create(req.body);

    const token = generateToken({ id: user._id, role: user.role, name: user.name });

    return createdResponse(res, 'User registered successfully', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await authRepository.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'User fetched', user);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  return successResponse(res, 'Logged out successfully');
};

module.exports = { login, register, getMe, logout };
