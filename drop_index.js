const mongoose = require('mongoose');

const uri = "mongodb+srv://Shikha_tale:vtoPatmIET43xBPt@cluster0.9bhoty5.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB.");
    const db = mongoose.connection.db;
    try {
      await db.collection('brokers').dropIndex('code_1');
      console.log("Successfully dropped 'code_1' index from brokers collection.");
    } catch (err) {
      console.error("Error dropping index (it may not exist):", err.message);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
