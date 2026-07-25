const chattingRepository = require('./chatting.repository');
const { successResponse, errorResponse, createdResponse } = require('../../utils/apiResponse');

// GET /api/chatting/users/online
const getOnlineUsers = async (req, res, next) => {
  try {
    const users = await chattingRepository.getOnlineUsers();
    return successResponse(res, 'Online users fetched', users);
  } catch (error) { next(error); }
};

// GET /api/chatting/users/offline
const getOfflineUsers = async (req, res, next) => {
  try {
    const users = await chattingRepository.getOfflineUsers();
    return successResponse(res, 'Offline users fetched', users);
  } catch (error) { next(error); }
};

// GET /api/chatting/messages/:userId
const getChatHistory = async (req, res, next) => {
  try {
    const messages = await chattingRepository.getChatHistory(req.user.id, req.params.userId);
    return successResponse(res, 'Chat history fetched', messages);
  } catch (error) { next(error); }
};

// POST /api/chatting/messages
const sendMessage = async (req, res, next) => {
  try {
    const data = { sender: req.user.id, receiver: req.body.receiver, text: req.body.text };
    const message = await chattingRepository.sendMessage(data);
    return createdResponse(res, 'Message sent', message);
  } catch (error) { next(error); }
};

// POST /api/chatting/broadcast
const broadcastMessage = async (req, res, next) => {
  try {
    const { text, receivers } = req.body;
    const messages = await chattingRepository.broadcastMessage(req.user.id, text, receivers);
    return createdResponse(res, 'Broadcast sent', { count: messages.length });
  } catch (error) { next(error); }
};

module.exports = { getOnlineUsers, getOfflineUsers, getChatHistory, sendMessage, broadcastMessage };
