const mongoose = require('mongoose');
require('dotenv').config();

async function runFix() {
  try {
    const mongoUri = 'mongodb+srv://Shikha_tale:vtoPatmIET43xBPt@cluster0.9bhoty5.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const Lead = mongoose.model('Lead', new mongoose.Schema({}, { strict: false }));
    const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));

    const leads = await Lead.find({});
    console.log(`Found ${leads.length} leads in total`);
    
    let count = 0;
    for (let lead of leads) {
      if (!lead.owner) continue;

      // Try finding an Employee with this ID
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
    console.error('Error:', err);
    process.exit(1);
  }
}

runFix();
