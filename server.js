require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', require('./routes/user'));
app.use('/api/student', require('./routes/student'));
app.use('/api/tutor', require('./routes/tutor'));
app.use('/api/lecturer', require('./routes/lecturer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/course', require('./routes/course'));
app.use('/api/studentcourse', require('./routes/studentcourse'));
app.use('/api/tutorcourse', require('./routes/tutorcourse'));
app.use('/api/lecturercourse', require('./routes/lecturercourse'));
app.use('/api/session', require('./routes/session'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/message', require('./routes/message'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/supportrequest', require('./routes/supportrequest'));
app.use('/api/adminactivitylog', require('./routes/adminactivitylog'));
app.use('/api/auth', require('./routes/authRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`🚀 Server running on http://localhost:${process.env.PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

