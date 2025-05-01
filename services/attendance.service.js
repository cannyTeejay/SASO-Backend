// Attendance-related functions
const checkInStudent = async (studentId, classId, checkInMethod) => {
  // Validate the class is currently active
  const currentClass = await Schedule.findById(classId);
  if (!currentClass) {
    throw new Error('Class not found');
  }

  // Check if student is enrolled in this class
  const isEnrolled = await checkEnrollment(studentId, currentClass.courseName);
  if (!isEnrolled) {
    throw new Error('Student not enrolled in this class');
  }

  // Create attendance record
  const attendance = new Attendance({
    student_id: studentId,
    session_id: classId,
    status: 'Present',
    checkInMethod,
    timestamp: new Date()
  });

  await attendance.save();
  
  // Send notification to lecturer
  await createNotification(
    currentClass.lecturer,
    'New Attendance Check-In',
    `Student ${studentId} has checked in for ${currentClass.courseName}`
  );

  return attendance;
};

const verifyAttendance = async (lecturerId, attendanceId) => {
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    throw new Error('Attendance record not found');
  }

  // Get the class to verify the lecturer teaches it
  const classSession = await Schedule.findById(attendance.session_id);
  if (classSession.lecturer.toString() !== lecturerId.toString()) {
    throw new Error('Unauthorized - You do not teach this class');
  }

  attendance.markedBy = lecturerId;
  attendance.status = 'Present'; // Confirm status
  await attendance.save();

  return attendance;
};

const getStudentAttendance = async (studentId, filters = {}) => {
  let query = { student_id: studentId };
  
  if (filters.course) {
    const classes = await Schedule.find({ courseName: filters.course });
    query.session_id = { $in: classes.map(c => c._id) };
  }
  
  if (filters.startDate && filters.endDate) {
    query.timestamp = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate)
    };
  }

  return await Attendance.find(query)
    .populate('session_id', 'courseName classroom dayOfWeek startTime endTime')
    .sort({ timestamp: -1 });
};
