const mongoose = require('mongoose');

async function testDB() {
  try {
    console.log('Connecting...');
    await mongoose.connect('mongodb+srv://Shikha_tale:vtoPatmIET43xBPt@cluster0.9bhoty5.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected!');
    
    // We want to see all leads for vandana!
    const leads = await mongoose.connection.collection('leads').find({}).sort({ createdAt: -1 }).limit(100).toArray();
    
    console.log(`Found ${leads.length} leads in total`);
    
    // Let's print out the first 5 leads
    for (let i = 0; i < Math.min(5, leads.length); i++) {
      console.log(`Lead ${i}: _id=${leads[i]._id}, owner=${leads[i].owner}, response=${leads[i].response}, clientName=${leads[i].clientName}`);
    }
    
    // Let's find Vandana's User ID
    const vandanaUser = await mongoose.connection.collection('users').findOne({ email: 'vandanapatelpatel3@gmail.com' });
    if (vandanaUser) {
      console.log('Vandana User ID:', vandanaUser._id);
      const vandanaLeads = leads.filter(l => l.owner && l.owner.toString() === vandanaUser._id.toString());
      console.log(`Found ${vandanaLeads.length} leads owned by Vandana in the top 100!`);
      if (vandanaLeads.length > 0) {
         console.log('First Vandana lead response:', vandanaLeads[0].response);
      }
    } else {
      console.log('Vandana user not found by email');
    }
    
  } catch(e) {
    console.error('DB Error:', e.message);
  } finally {
    mongoose.disconnect();
  }
}
testDB();
