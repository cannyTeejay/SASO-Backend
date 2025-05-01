/**
 * Department Service - Handles campus, faculty, and department management
 */
const Campus = require('../models/Campus');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Gets complete campus hierarchy with faculties and departments
   * @returns {Promise<Array>} List of campuses with populated faculties and departments
   * @throws {Error} If retrieval fails
   */
  async getCampusHierarchy() {
    try {
      return await Campus.find().populate({
        path: 'faculties',
        populate: {
          path: 'departments',
          select: 'departmentName'
        },
        select: 'facultyName'
      });
    } catch (error) {
      throw new ErrorHandler(500, 'Failed to retrieve campus hierarchy');
    }
  },

  /**
   * Creates a new faculty under a campus
   * @param {string} campusId - ID of the parent campus
   * @param {string} facultyName - Name of the new faculty
   * @returns {Promise<Object>} Created faculty
   * @throws {Error} If campus not found or creation fails
   */
  async createFaculty(campusId, facultyName) {
    try {
      // Verify campus exists
      const campus = await Campus.findById(campusId);
      if (!campus) {
        throw new ErrorHandler(404, 'Campus not found');
      }

      // Create new faculty
      const faculty = new Faculty({
        facultyName,
        campus: campusId
      });

      await faculty.save();

      // Add faculty to campus's faculties array
      campus.faculties.push(faculty._id);
      await campus.save();

      return faculty;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create faculty');
    }
  },

  /**
   * Gets all departments under a faculty
   * @param {string} facultyId - ID of the faculty
   * @returns {Promise<Array>} List of departments
   * @throws {Error} If faculty not found or retrieval fails
   */
  async getDepartmentsByFaculty(facultyId) {
    try {
      // Verify faculty exists
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        throw new ErrorHandler(404, 'Faculty not found');
      }

      return await Department.find({ faculty: facultyId });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve departments');
    }
  },

  /**
   * Creates a new department under a faculty
   * @param {string} facultyId - ID of the parent faculty
   * @param {string} departmentName - Name of the new department
   * @returns {Promise<Object>} Created department
   * @throws {Error} If faculty not found or creation fails
   */
  async createDepartment(facultyId, departmentName) {
    try {
      // Verify faculty exists
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        throw new ErrorHandler(404, 'Faculty not found');
      }

      // Create new department
      const department = new Department({
        departmentName,
        faculty: facultyId
      });

      await department.save();

      // Add department to faculty's departments array
      faculty.departments.push(department._id);
      await faculty.save();

      return department;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create department');
    }
  },

  /**
   * Gets campus-specific attendance report
   * @param {string} campusId - ID of the campus
   * @param {Object} dateRange - Optional date range filter
   * @returns {Promise<Object>} Campus attendance statistics
   * @throws {Error} If campus not found or report generation fails
   */
  async getCampusAttendanceReport(campusId, dateRange = {}) {
    try {
      const campus = await Campus.findById(campusId);
      if (!campus) {
        throw new ErrorHandler(404, 'Campus not found');
      }

      // Get all faculties in campus
      const faculties = await Faculty.find({ campus: campusId });

      // Get all departments in these faculties
      const departments = await Department.find({ 
        faculty: { $in: faculties.map(f => f._id) } 
      });

      // Get all students in these departments
      const students = await User.find({ 
        department: { $in: departments.map(d => d._id) } 
      });

      // Build match stage for aggregation
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

      // Execute aggregation
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

      // Calculate totals
      const totalRecords = report.reduce((sum, item) => sum + item.count, 0);
      const presentCount = report.find(item => item.status === 'Present')?.count || 0;
      const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      return {
        campus: campus.campusName,
        faculties: faculties.length,
        departments: departments.length,
        students: students.length,
        attendanceStats: report,
        totalRecords,
        attendanceRate: attendanceRate.toFixed(2),
        dateRange
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to generate campus report');
    }
  }
};
