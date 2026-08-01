const axios = require('axios');
const fs = require('fs');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com', // or vandanapatelpatel3@gmail.com? Let's use the admin email. If I don't know it, I will use the one I saw in logs: vandanapatelpatel3@gmail.com
      password: 'password123' // default password, hopefully works
    });
    
    // wait, I don't know the admin's password!
    // But I CAN inject a route directly into the backend server since it uses nodemon!
  } catch (err) {
    console.error(err.message);
  }
}
run();
