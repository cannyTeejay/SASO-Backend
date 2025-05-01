const express = require('express');
const mongoose = require('mongoose');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

app.use('/api/attendance', attendanceRoutes);
app.use(express.static('public'));

const dbURL = 'mongodb+srv://saso:test123@saso2studentattendances.z6w8let.mongodb.net/saso2studentattendancesystemdb';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(3000, () => console.log('Server is running on port 3000'));
})
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
});

