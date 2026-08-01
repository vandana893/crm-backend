const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect('mongodb+srv://crm_user:Danish%40786@cluster0.pxt8v.mongodb.net/crm_database?retryWrites=true&w=majority').then(async () => {
  try {
    const Lead = mongoose.model('Lead', new Schema({}, { strict: false }));
    const Employee = mongoose.model('Employee', new Schema({}, { strict: false }));
    
    // Find all leads where owner is not null
    const leads = await Lead.find({ owner: { $ne: null } });
    let updated = 0;
    for (let lead of leads) {
      if (!lead.owner) continue;
      const emp = await Employee.findById(lead.owner);
      if (emp && emp.user) {
        // The owner is an Employee ID! Update it to User ID
        await Lead.updateOne({ _id: lead._id }, { $set: { owner: emp.user } });
        updated++;
      }
    }
    console.log('Fixed', updated, 'leads.');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
});
