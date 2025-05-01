/**
 * Schedule Service - Handles class scheduling and timetable management
 */
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Creates a new class schedule
   * @param {string} lecturerId - ID of the lecturer
   * @param {Object} scheduleData - Schedule data (courseName, dayOfWeek, etc)
   * @returns {Promise<Object>} Created schedule
   * @throws {Error} If validation fails or schedule conflict exists
   */
  async createClassSchedule(lecturerId, scheduleData) {
    try {
      // Verify lecturer exists and is actually a lecturer
      const lecturer = await User.findById(lecturerId);
      if (!lecturer || lecturer.role !== 'Lecturer') {
        throw new ErrorHandler(403, 'Only lecturers can create schedules');
      }

      // Validate required fields
      if (!scheduleData.courseName || !scheduleData.dayOfWeek || 
          !scheduleData.startTime || !scheduleData.endTime) {
        throw new ErrorHandler(400, 'Missing required schedule fields');
      }

      // Check for scheduling conflicts
      const hasConflict = await this.checkClassConflict(
        lecturerId,
        scheduleData.dayOfWeek,
        scheduleData.startTime,
        scheduleData.endTime
      );
      
      if (hasConflict) {
        throw new ErrorHandler(409, 'Schedule conflict detected');
      }

      // Create new schedule
      const schedule = new Schedule({
        ...scheduleData,
        lecturer: lecturerId
      });

      await schedule.save();
      return schedule;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create schedule');
    }
  },

  /**
   * Checks for scheduling conflicts
   * @param {string} lecturerId - Lecturer ID
   * @param {string} dayOfWeek - Day of week (e.g., "Monday")
   * @param {string} startTime - Class start time (HH:MM)
   * @param {string} endTime - Class end time (HH:MM)
   * @returns {Promise<boolean>} True if conflict exists
   */
  async checkClassConflict(lecturerId, dayOfWeek, startTime, endTime) {
    try {
      const conflicts = await Schedule.find({
        lecturer: lecturerId,
        dayOfWeek,
        $or: [
          { 
            startTime: { $lt: endTime }, 
            endTime: { $gt: startTime } 
          }
        ]
      });

      return conflicts.length > 0;
    } catch (error) {
      throw new ErrorHandler(500, 'Failed to check schedule conflicts');
    }
  },

  /**
   * Gets schedule for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} List of class schedules
   * @throws {Error} If student not found or schedule retrieval fails
   */
  async getStudentSchedule(studentId) {
    try {
      // Verify student exists
      const student = await User.findById(studentId);
      if (!student) {
        throw new ErrorHandler(404, 'Student not found');
      }

      // In a real implementation, you would filter by the student's enrolled courses
      // For this example, we'll return all schedules
      return await Schedule.find({})
        .populate('lecturer', 'first_name last_name')
        .sort({ dayOfWeek: 1, startTime: 1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve schedule');
    }
  },

  /**
   * Gets schedule for a lecturer
   * @param {string} lecturerId - Lecturer ID
   * @returns {Promise<Array>} List of class schedules
   * @throws {Error} If lecturer not found or schedule retrieval fails
   */
  async getLecturerSchedule(lecturerId) {
    try {
      // Verify lecturer exists
      const lecturer = await User.findById(lecturerId);
      if (!lecturer || lecturer.role !== 'Lecturer') {
        throw new ErrorHandler(404, 'Lecturer not found');
      }

      return await Schedule.find({ lecturer: lecturerId })
        .sort({ dayOfWeek: 1, startTime: 1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve lecturer schedule');
    }
  },

  /**
   * Updates a class schedule
   * @param {string} scheduleId - Schedule ID to update
   * @param {string} lecturerId - Lecturer ID (for authorization)
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated schedule
   * @throws {Error} If schedule not found, unauthorized, or validation fails
   */
  async updateSchedule(scheduleId, lecturerId, updates) {
    try {
      // Verify schedule exists and belongs to this lecturer
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw new ErrorHandler(404, 'Schedule not found');
      }

      if (schedule.lecturer.toString() !== lecturerId.toString()) {
        throw new ErrorHandler(403, 'Unauthorized to update this schedule');
      }

      // Check for conflicts if time/day is being updated
      if (updates.dayOfWeek || updates.startTime || updates.endTime) {
        const day = updates.dayOfWeek || schedule.dayOfWeek;
        const start = updates.startTime || schedule.startTime;
        const end = updates.endTime || schedule.endTime;

        const conflicts = await Schedule.find({
          _id: { $ne: scheduleId }, // Exclude current schedule
          lecturer: lecturerId,
          dayOfWeek: day,
          $or: [
            { 
              startTime: { $lt: end }, 
              endTime: { $gt: start } 
            }
          ]
        });

        if (conflicts.length > 0) {
          throw new ErrorHandler(409, 'Schedule conflict detected');
        }
      }

      // Apply updates
      Object.keys(updates).forEach(key => {
        schedule[key] = updates[key];
      });

      await schedule.save();
      return schedule;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to update schedule');
    }
  }
};
