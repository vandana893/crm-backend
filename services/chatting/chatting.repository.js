const { Message, OnlineStatus } = require('./chatting.model');

const getOnlineUsers = async () => {
  return OnlineStatus.find({ isOnline: true }).populate('user', 'name role');
};

const getOfflineUsers = async () => {
  return OnlineStatus.find({ isOnline: false }).populate('user', 'name role');
};

const getChatHistory = async (userId1, userId2, limit = 50) => {
  return Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  })
    .populate('sender receiver', 'name')
    .sort({ createdAt: 1 })
    .limit(limit);
};

const sendMessage = async (data) => {
  return Message.create(data);
};

const broadcastMessage = async (senderId, text, receivers) => {
  const messages = receivers.map((receiver) => ({
    sender: senderId,
    receiver,
    text,
    isBroadcast: true,
  }));
  return Message.insertMany(messages);
};

const updateOnlineStatus = async (userId, isOnline) => {
  return OnlineStatus.findOneAndUpdate(
    { user: userId },
    { isOnline, lastSeen: new Date() },
    { upsert: true, new: true }
  );
};

module.exports = { getOnlineUsers, getOfflineUsers, getChatHistory, sendMessage, broadcastMessage, updateOnlineStatus };
