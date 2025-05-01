/**
 * Attendance Service - Handles all attendance-related business logic
 */
const Attendance = require('../models/Attendance');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { ErrorHandler } = require('../utils/errorHandler');
const { createNotification } = require('./notification.service');

module.exports = {
  /**
   * Records student attendance for a class session
   * @param {string} studentId - ID of the student checking in
   * @param {string} classId - ID of the class session
   * @param {string} checkInMethod - Method used for check-in (QR, GPS, etc)
   * @returns {Promise<Object>} Created attendance record
   * @throws {Error} If class not found, student not enrolled or other validation fails
   */
  async checkInStudent(studentId, classId, checkInMethod) {
    try {
      // Verify student exists
      const student = await User.findById(studentId).select('first_name last_name');
      if (!student) {
        throw new ErrorHandler(404, 'Student not found');
      }

      // Verify class exists and is active
      const currentClass = await Schedule.findById(classId)
        .populate('lecturer', 'first_name last_name');
      
      if (!currentClass) {
        throw new ErrorHandler(404, 'Class session not found');
      }

      // Check if student is enrolled in this class (implementation depends on your enrollment system)
      const isEnrolled = true; // Replace with actual enrollment check
      if (!isEnrolled) {
        throw new ErrorHandler(403, 'Student is not enrolled in this class');
      }

      // Prevent duplicate check-ins for same class
      const existingAttendance = await Attendance.findOne({
        student_id: studentId,
        session_id: classId,
        status: 'Present'
      });

      if (existingAttendance) {
        throw new ErrorHandler(400, 'Attendance already recorded for this class');
      }

      // Create new attendance record
      const attendance = new Attendance({
        student_id: studentId,
        session_id: classId,
        status: 'Present',
        checkInMethod,
        timestamp: new Date()
      });

      await attendance.save();
      
      // Notify lecturer about the check-in
      await createNotification(
        currentClass.lecturer._id,
        'New Attendance Check-In',
        `Student ${student.first_name} ${student.last_name} has checked in for ${currentClass.courseName}`,
        {
          attendanceId: attendance._id,
          classId: currentClass._id,
          studentId: student._id
        }
      );

      return attendance;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to record attendance');
    }
  },

  /**
   * Verifies/confirms student attendance by lecturer
   * @param {string} lecturerId - ID of the verifying lecturer
   * @param {string} attendanceId - ID of attendance record to verify
   * @returns {Promise<Object>} Updated attendance record
   * @throws {Error} If record not found, lecturer unauthorized or other validation fails
   */
  async verifyAttendance(lecturerId, attendanceId) {
    try {
      const attendance = await Attendance.findById(attendanceId);
      if (!attendance) {
        throw new ErrorHandler(404, 'Attendance record not found');
      }

      // Verify lecturer exists
      const lecturer = await User.findById(lecturerId);
      if (!lecturer || lecturer.role !== 'Lecturer') {
        throw new ErrorHandler(403, 'Only lecturers can verify attendance');
      }

      // Verify class session exists and lecturer teaches it
      const classSession = await Schedule.findById(attendance.session_id);
      if (!classSession) {
        throw new ErrorHandler(404, 'Class session not found');
      }
      
      if (classSession.lecturer.toString() !== lecturerId.toString()) {
        throw new ErrorHandler(403, 'Unauthorized - You do not teach this class');
      }

      // Update attendance record
      attendance.markedBy = lecturerId;
      attendance.status = 'Present';
      attendance.verifiedAt = new Date();
      await attendance.save();

      return attendance;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to verify attendance');
    }
  },

  /**
   * Retrieves attendance records for a student with optional filters
   * @param {string} studentId - ID of the student
   * @param {Object} filters - Optional filters (course, dateRange, status)
   * @returns {Promise<Array>} List of attendance records with populated data
   * @throws {Error} If student not found or other errors occur
   */
  async getStudentAttendance(studentId, filters = {}) {
    try {
      // Verify student exists
      const student = await User.findById(studentId);
      if (!student) {
        throw new ErrorHandler(404, 'Student not found');
      }

      let query = { student_id: studentId };
      
      // Apply course filter if provided
      if (filters.course) {
        const classes = await Schedule.find({ 
          courseName: { $regex: filters.course, $options: 'i' } 
        });
        query.session_id = { $in: classes.map(c => c._id) };
      }
      
      // Apply date range filter if provided
      if (filters.startDate && filters.endDate) {
        query.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      // Apply status filter if provided
      if (filters.status) {
        query.status = filters.status;
      }

      return await Attendance.find(query)
        .populate({
          path: 'session_id',
          select: 'courseName classroom dayOfWeek startTime endTime lecturer',
          populate: {
            path: 'lecturer',
            select: 'first_name last_name'
          }
        })
        .populate({
          path: 'markedBy',
          select: 'first_name last_name'
        })
        .sort({ timestamp: -1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve attendance records');
    }
  }
};
