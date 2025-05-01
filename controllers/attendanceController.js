const Attendance = require('../models/Attendance');

// Create a new attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { session_id, student_id } = req.body;

    // Check if the student is already signed in for the session
    const existingAttendance = await Attendance.findOne({ session_id, student_id });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Student has already signed in for this session.' });
    }

    // Verify if the student is registered for the session's course
    const session = await Session.findById(session_id).populate('course_id');
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const isStudentRegistered = await StudentCourse.findOne({
      student_id,
      course_id: session.course_id._id,
    });

    if (!isStudentRegistered) {
      return res.status(400).json({ message: 'Student is not registered for this course.' });
    }

    // Create the attendance record
    const attendance = new Attendance(req.body);
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('session_id').populate('student_id').populate('markedBy');
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('session_id').populate('student_id').populate('markedBy');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by session or student
exports.getAttendanceByFilter = async (req, res) => {
  try {
    const { session_id, student_id } = req.query;
    const filter = {};
    if (session_id) filter.session_id = session_id;
    if (student_id) filter.student_id = student_id;

    const attendanceRecords = await Attendance.find(filter).populate('session_id').populate('student_id').populate('markedBy');
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};