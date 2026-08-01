const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect('mongodb+srv://Shikha_tale:vtoPatmIET43xBPt@cluster0.9bhoty5.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0');
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const vandanaUser = await User.findOne({ email: /vandana/i });
    if (!vandanaUser) {
      console.log('Vandana not found');
      process.exit(1);
    }
    console.log('Vandana ID:', vandanaUser._id);
    
    const Lead = mongoose.model('Lead', new mongoose.Schema({}, { strict: false }));
    
    // Simulating findAll
    const query1 = { isBlocked: false, owner: vandanaUser._id };
    const leads1 = await Lead.find(query1).sort({ createdAt: -1 }).limit(10);
    console.log('findAll returns:', leads1.length, 'leads');
    if (leads1.length > 0) {
      console.log('First lead response:', leads1[0].response);
    }

    // Simulating findFetchable
    const query2 = { isBlocked: false, owner: vandanaUser._id };
    const leads2 = await Lead.find(query2).sort({ createdAt: -1 }).limit(50);
    console.log('findFetchable returns:', leads2.length, 'leads');
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

test();
