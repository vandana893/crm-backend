const Lead = require('./leads.model');

const findAll = async (filters = {}, pagination = {}) => {
  const query = { isBlocked: false, ...filters };
  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .populate('owner', 'name role')
    .skip(pagination.skip || 0)
    .limit(pagination.limit || 10)
    .sort({ createdAt: -1 });

  return { leads, total };
};

const findById = async (id) => {
  return Lead.findById(id).populate('owner', 'name role');
};

const create = async (data) => {
  return Lead.create(data);
};

const updateById = async (id, data) => {
  return Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('owner', 'name role');
};

const deleteById = async (id) => {
  return Lead.findByIdAndDelete(id);
};

const updateComment = async (id, comment) => {
  return Lead.findByIdAndUpdate(id, { comment }, { new: true });
};

const updateResponse = async (id, response) => {
  return Lead.findByIdAndUpdate(id, { response }, { new: true });
};

const findByFilters = async (filters) => {
  const query = { isBlocked: false };

  if (filters.response) query.response = filters.response;
  if (filters.source) query.source = filters.source;
  if (filters.type) query.type = filters.type;
  if (filters.owner) query.owner = filters.owner;
  if (filters.mobile) query.mobile = { $regex: filters.mobile, $options: 'i' };

  if (filters.fromDate && filters.toDate) {
    query.createdAt = {
      $gte: new Date(filters.fromDate),
      $lte: new Date(filters.toDate),
    };
  }

  return Lead.find(query).populate('owner', 'name role').sort({ createdAt: -1 });
};

const findFollowups = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return Lead.find({
    response: 'Followup',
    callbackDate: { $gte: today, $lt: tomorrow },
    isBlocked: false,
  }).populate('owner', 'name role');
};

const findDisposed = async () => {
  return Lead.find({
    response: { $in: ['Not Interested', 'Disposed'] },
    isBlocked: false,
  }).populate('owner', 'name role');
};

const findRepeat = async () => {
  return Lead.aggregate([
    { $group: { _id: '$mobile', count: { $sum: 1 }, leads: { $push: '$$ROOT' } } },
    { $match: { count: { $gt: 1 } } },
  ]);
};

const findHotLeads = async () => {
  return Lead.find({ type: 'Hot', isBlocked: false }).populate('owner', 'name role');
};

const bulkCreate = async (leads) => {
  return Lead.insertMany(leads, { ordered: false });
};

module.exports = {
  findAll, findById, create, updateById, deleteById,
  updateComment, updateResponse, findByFilters,
  findFollowups, findDisposed, findRepeat, findHotLeads, bulkCreate,
};
