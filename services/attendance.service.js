const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { createNotification } = require('./notification.service');

module.exports = {
  checkInStudent: async (studentId, classId, checkInMethod) => {
    const currentClass = await Schedule.findById(classId);
    if (!currentClass) throw new Error('Class not found');
    
    const attendance = new Attendance({
      student_id: studentId,
      session_id: classId,
      status: 'Present',
      checkInMethod,
      timestamp: new Date()
    });

    await attendance.save();
    await createNotification(
      currentClass.lecturer,
      'New Attendance Check-In',
      `Student has checked in for ${currentClass.courseName}`
    );

    return attendance;
  },

  verifyAttendance: async (lecturerId, attendanceId) => {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) throw new Error('Attendance record not found');

    const classSession = await Schedule.findById(attendance.session_id);
    if (classSession.lecturer.toString() !== lecturerId.toString()) {
      throw new Error('Unauthorized - You do not teach this class');
    }

    attendance.markedBy = lecturerId;
    attendance.status = 'Present';
    await attendance.save();

    return attendance;
  },

  getStudentAttendance: async (studentId, filters = {}) => {
    let query = { student_id: studentId };
    
    if (filters.course) {
      const classes = await Schedule.find({ courseName: filters.course });
      query.session_id = { $in: classes.map(c => c._id) };
    }
    
    if (filters.dateRange) {
      query.timestamp = {
        $gte: new Date(filters.dateRange.start),
        $lte: new Date(filters.dateRange.end)
      };
    }

    return await Attendance.find(query)
      .populate('session_id', 'courseName classroom dayOfWeek startTime endTime')
      .sort({ timestamp: -1 });
  }
};
