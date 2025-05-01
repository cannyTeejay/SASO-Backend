/**
 * Report Service - Handles data analysis and reporting
 */
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Department = require('../models/Department');
const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Generates attendance summary report with filters
   * @param {Object} filters - Report filters (department, dateRange, course)
   * @returns {Promise<Object>} Aggregated attendance statistics
   * @throws {Error} If report generation fails
   */
  async generateAttendanceReport(filters = {}) {
    try {
      let matchStage = {};
      
      // Filter by department if specified
      if (filters.department) {
        const department = await Department.findById(filters.department);
        if (!department) {
          throw new ErrorHandler(404, 'Department not found');
        }

        const students = await User.find({ department: filters.department });
        matchStage.student_id = { $in: students.map(s => s._id) };
      }
      
      // Filter by date range if specified
      if (filters.startDate && filters.endDate) {
        matchStage.timestamp = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      // Filter by course if specified
      if (filters.course) {
        const classes = await Schedule.find({ 
          courseName: { $regex: filters.course, $options: 'i' } 
        });
        matchStage.session_id = { $in: classes.map(c => c._id) };
      }

      // Execute aggregation pipeline
      const report = await Attendance.aggregate([
        { $match: matchStage },
        { 
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { 
          $project: {
            status: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]);

      // Calculate totals and percentages
      const totalRecords = report.reduce((sum, item) => sum + item.count, 0);
      const presentCount = report.find(item => item.status === 'Present')?.count || 0;
      const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      return {
        stats: report,
        totalRecords,
        attendanceRate: attendanceRate.toFixed(2),
        startDate: filters.startDate,
        endDate: filters.endDate
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to generate attendance report');
    }
  },

  /**
   * Gets detailed attendance statistics for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Detailed attendance statistics
   * @throws {Error} If student not found or statistics calculation fails
   */
  async getStudentAttendanceStats(studentId) {
    try {
      const student = await User.findById(studentId);
      if (!student) {
        throw new ErrorHandler(404, 'Student not found');
      }

      // Get basic attendance stats by status
      const stats = await Attendance.aggregate([
        { $match: { student_id: mongoose.Types.ObjectId(studentId) } },
        { 
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get course-wise attendance
      const courseStats = await Attendance.aggregate([
        { $match: { student_id: mongoose.Types.ObjectId(studentId) } },
        {
          $lookup: {
            from: 'schedules',
            localField: 'session_id',
            foreignField: '_id',
            as: 'class'
          }
        },
        { $unwind: '$class' },
        {
          $group: {
            _id: '$class.courseName',
            present: {
              $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
            },
            absent: {
              $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
            },
            excused: {
              $sum: { $cond: [{ $eq: ['$status', 'Excused'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            course: '$_id',
            present: 1,
            absent: 1,
            excused: 1,
            total: { $add: ['$present', '$absent', '$excused'] },
            attendanceRate: {
              $multiply: [
                { $divide: ['$present', { $add: ['$present', '$absent', '$excused'] }] },
                100
              ]
            },
            _id: 0
          }
        }
      ]);

      // Calculate overall totals
      const totalClasses = stats.reduce((sum, item) => sum + item.count, 0);
      const presentCount = stats.find(s => s.status === 'Present')?.count || 0;
      const attendanceRate = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      return {
        overallStats: stats,
        courseStats,
        totalClasses,
        attendanceRate: attendanceRate.toFixed(2),
        lastUpdated: new Date()
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to calculate attendance statistics');
    }
  },

  /**
   * Generates department-wide attendance report
   * @param {string} departmentId - Department ID
   * @param {Object} dateRange - Optional date range filter
   * @returns {Promise<Object>} Department attendance report
   * @throws {Error} If department not found or report generation fails
   */
  async getDepartmentReport(departmentId, dateRange = {}) {
    try {
      const department = await Department.findById(departmentId)
        .populate('faculty', 'facultyName');
      
      if (!department) {
        throw new ErrorHandler(404, 'Department not found');
      }

      // Get all students in department
      const students = await User.find({ department: departmentId });

      let matchStage = {
        student_id: { $in: students.map(s => s._id) }
      };

      // Apply date range if provided
      if (dateRange.startDate && dateRange.endDate) {
        matchStage.timestamp = {
          $gte: new Date(dateRange.startDate),
          $lte: new Date(dateRange.endDate)
        };
      }

      // Get aggregated attendance data
      const attendanceData = await Attendance.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get top courses by attendance
      const topCourses = await Attendance.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'schedules',
            localField: 'session_id',
            foreignField: '_id',
            as: 'class'
          }
        },
        { $unwind: '$class' },
        {
          $group: {
            _id: '$class.courseName',
            present: {
              $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
            },
            total: { $sum: 1 }
          }
        },
        {
          $project: {
            course: '$_id',
            present: 1,
            total: 1,
            attendanceRate: {
              $multiply: [
                { $divide: ['$present', '$total'] },
                100
              ]
            },
            _id: 0
          }
        },
        { $sort: { attendanceRate: -1 } },
        { $limit: 5 }
      ]);

      // Calculate totals
      const totalRecords = attendanceData.reduce((sum, item) => sum + item.count, 0);
      const presentCount = attendanceData.find(item => item._id === 'Present')?.count || 0;
      const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      return {
        department: {
          name: department.departmentName,
          faculty: department.faculty.facultyName
        },
        studentCount: students.length,
        attendanceStats: attendanceData,
        topCourses,
        totalRecords,
        attendanceRate: attendanceRate.toFixed(2),
        dateRange
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to generate department report');
    }
  }
};
