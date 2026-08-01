const mongoose = require('mongoose');

async function fixLeads() {
  try {
    await mongoose.connect('mongodb+srv://crm_user:Danish%40786@cluster0.pxt8v.mongodb.net/crm_database?retryWrites=true&w=majority');
    const Lead = mongoose.model('Lead', new mongoose.Schema({}, { strict: false }));
    const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));

    const leads = await Lead.find({});
    let count = 0;

    for (let lead of leads) {
      if (!lead.owner) continue;

      // Check if the owner is an Employee ID
      const emp = await Employee.findById(lead.owner);
      if (emp && emp.user) {
        console.log(`Fixing lead ${lead._id}: changing owner from Employee ${emp._id} to User ${emp.user}`);
        await Lead.updateOne({ _id: lead._id }, { $set: { owner: emp.user } });
        count++;
      }
    }
    
    console.log(`Fixed ${count} leads.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixLeads();
