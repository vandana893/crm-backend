const Company = require('./models/company.model');
const Broker = require('./models/broker.model');
const Template = require('./models/template.model');
const LeadResponse = require('./models/leadResponse.model');
const LeadStatus = require('./models/leadStatus.model');
const LeadSource = require('./models/leadSource.model');
const Department = require('./models/department.model');
const Profile = require('./models/profile.model');
const Employee = require('./models/employee.model');
const Team = require('./models/team.model');
const Lead = require('../leads/leads.model');

// ─── Generic CRUD Factory ───────────────────────────────────────────
const createCRUD = (Model, populateFields = '') => ({
  findAll: async (filters = {}) => Model.find(filters).populate(populateFields).sort({ createdAt: -1 }),
  findById: async (id) => Model.findById(id).populate(populateFields),
  create: async (data) => Model.create(data),
  updateById: async (id, data) => Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: async (id) => Model.findByIdAndDelete(id),
});

// ─── Per-entity Repositories ─────────────────────────────────────────
const company = {
  get: async () => Company.findOne(),
  update: async (data) => Company.findOneAndUpdate({}, data, { new: true, upsert: true, runValidators: true }),
};

const brokers = createCRUD(Broker);
const templates = createCRUD(Template, 'createdBy');
const leadResponses = createCRUD(LeadResponse);
const leadStatuses = createCRUD(LeadStatus);
const leadSources = createCRUD(LeadSource);
const departments = createCRUD(Department, 'head');
const profiles = createCRUD(Profile);
const employees = {
  findAll: async (filters = {}) => Employee.find(filters).populate('department team user').sort({ createdAt: -1 }),
  findById: async (id) => Employee.findById(id).populate('department team user'),
  create: async (data) => {
    // Determine the role for the User (mapping from Employee role/profile if necessary)
    const roleMapping = {
      'admin': 'Admin',
      'manager': 'Manager',
      'sba': 'SBA',
      'tl': 'TL',
      'arm': 'ARM'
    };
    const userRole = roleMapping[data.profile?.toLowerCase()] || roleMapping[data.role?.toLowerCase()] || 'SBA';
    
    // Create corresponding User for login
    const User = require('../auth/auth.model');
    const newUser = await User.create({
      name: data.name,
      email: data.email || `${data.username || data.name.replace(/\s+/g, '')}@company.com`,
      password: data.password || 'password123',
      role: userRole,
      phone: data.mobile || data.phone,
      isActive: data.status === 'Active' ? true : data.isActive !== false,
    });
    
    data.user = newUser._id;
    return Employee.create(data);
  },
  updateById: async (id, data) => {
    const employee = await Employee.findById(id);
    if (employee && employee.user) {
      const User = require('../auth/auth.model');
      const updateData = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.password) updateData.password = data.password; // Note: In a real app we'd hash it, User model has a pre-save hook for password but findByIdAndUpdate bypasses it. We should use findById and save.
      if (data.status) updateData.isActive = data.status === 'Active';
      if (data.mobile) updateData.phone = data.mobile;
      
      const user = await User.findById(employee.user);
      if (user) {
        Object.assign(user, updateData);
        await user.save(); // triggers password hash if changed
      }
    }
    return Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
  deleteById: async (id) => {
    const employee = await Employee.findById(id);
    if (employee && employee.user) {
      const User = require('../auth/auth.model');
      await User.findByIdAndDelete(employee.user);
    }
    return Employee.findByIdAndDelete(id);
  }
};
const teams = createCRUD(Team, 'leader members department');

// ─── Special Operations ──────────────────────────────────────────────
const leadAllot = async (leadIds, employeeId) => {
  return Lead.updateMany({ _id: { $in: leadIds } }, { owner: employeeId });
};

const dealerAllot = async (leadIds, dealerId) => {
  return Lead.updateMany({ _id: { $in: leadIds } }, { dealer: dealerId });
};

const getFetchLimits = async () => {
  return Employee.find({ isActive: true }).select('name role fetchLimit').sort({ name: 1 });
};

const updateFetchLimits = async (limits) => {
  const operations = limits.map((l) => ({
    updateOne: {
      filter: { _id: l.employeeId },
      update: { fetchLimit: l.limit },
    },
  }));
  return Employee.bulkWrite(operations);
};

const leadRecycle = async (filters) => {
  return Lead.updateMany(filters, { response: 'New', owner: null });
};

const getPermissions = async (profileId) => {
  return Profile.findById(profileId).select('name permissions');
};

const updatePermissions = async (profileId, permissions) => {
  return Profile.findByIdAndUpdate(profileId, { permissions }, { new: true });
};

const getGraphSales = async () => {
  return Lead.aggregate([
    { $match: { response: { $in: ['Fund Added', 'Trade Done'] } } },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = {
  company, brokers, templates, leadResponses, leadStatuses, leadSources,
  departments, profiles, employees, teams,
  leadAllot, dealerAllot, getFetchLimits, updateFetchLimits,
  leadRecycle, getPermissions, updatePermissions, getGraphSales,
};
