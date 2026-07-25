/**
 * Standard API Response Helpers
 * Har API ek consistent format mein response degi
 */

const successResponse = (res, message, data = null, statusCode = 200, pagination = null) => {
  const response = { success: true, message };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = { success: false, message };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

const createdResponse = (res, message, data) => {
  return successResponse(res, message, data, 201);
};

module.exports = { successResponse, errorResponse, createdResponse };
