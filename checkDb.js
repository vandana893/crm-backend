const mongoose = require('mongoose');

const uri = "mongodb+srv://Shikha_tale:vtoPatmIET43xBPt@cluster0.9bhoty5.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const leads = await db.collection('leads').find().sort({createdAt: -1}).limit(5).toArray();
  const users = await db.collection('users').find({ role: 'Employee' }).toArray();
  
  console.log("--- LATEST 5 LEADS ---");
  leads.forEach(l => console.log(`Lead: ${l.clientName}, Mobile: ${l.mobile}, Owner: ${l.owner}, Response: ${l.response}`));
  
  console.log("\n--- EMPLOYEES ---");
  users.forEach(u => console.log(`User: ${u.name}, ID: ${u._id}`));
  
  process.exit(0);
}

run().catch(console.dir);
