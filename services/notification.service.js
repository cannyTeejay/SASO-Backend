/**
 * Notification Service - Handles system notifications
 */
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Creates a new notification for a user
   * @param {string} userId - Recipient user ID
   * @param {string} title - Notification title
   * @param {string} message - Notification content
   * @param {Object} metadata - Additional notification data (optional)
   * @returns {Promise<Object>} Created notification
   * @throws {Error} If user not found or notification creation fails
   */
  async createNotification(userId, title, message, metadata = {}) {
    try {
      // Verify recipient exists
      const user = await User.findById(userId);
      if (!user) {
        throw new ErrorHandler(404, 'Recipient user not found');
      }

      const notification = new Notification({
        user: userId,
        title,
        message,
        metadata,
        isRead: false
      });

      await notification.save();
      return notification;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create notification');
    }
  },

  /**
   * Marks a notification as read
   * @param {string} notificationId - ID of notification to update
   * @param {string} userId - ID of user marking as read
   * @returns {Promise<Object>} Updated notification
   * @throws {Error} If notification not found or user unauthorized
   */
  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new ErrorHandler(404, 'Notification not found');
      }

      // Verify user owns this notification
      if (notification.user.toString() !== userId.toString()) {
        throw new ErrorHandler(403, 'Unauthorized to mark this notification as read');
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      return notification;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to update notification');
    }
  },

  /**
   * Retrieves notifications for a user
   * @param {string} userId - ID of the user
   * @param {Object} options - Query options (limit, unreadOnly, etc)
   * @returns {Promise<Array>} List of notifications
   * @throws {Error} If user not found or retrieval fails
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      const query = { user: userId };
      
      if (options.unreadOnly) {
        query.isRead = false;
      }

      const limit = options.limit || 20;
      const sort = options.sort || { createdAt: -1 };

      return await Notification.find(query)
        .sort(sort)
        .limit(limit);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve notifications');
    }
  },

  /**
   * Checks for absence patterns and sends notifications
   * @param {string} studentId - Student ID to check
   * @returns {Promise<void>}
   * @throws {Error} If student not found or notification fails
   */
  async checkAbsencePatterns(studentId) {
    try {
      const student = await User.findById(studentId);
      if (!student) {
        throw new ErrorHandler(404, 'Student not found');
      }

      // Get absences in last 30 days
      const absences = await Attendance.find({
        student_id: studentId,
        status: 'Absent',
        timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });

      // Send warning if threshold reached
      if (absences.length >= 3) {
        await this.createNotification(
          studentId,
          'Attendance Warning',
          `You've missed ${absences.length} classes in the last 30 days. Please check your attendance records.`,
          {
            type: 'attendance_warning',
            absenceCount: absences.length
          }
        );
        
        // Notify admins if severe pattern
        if (absences.length >= 5) {
          const admins = await User.find({ role: 'Admin' });
          for (const admin of admins) {
            await this.createNotification(
              admin._id,
              'Severe Absence Pattern',
              `Student ${student.first_name} ${student.last_name} (${student.email}) has missed ${absences.length} classes in the last 30 days.`,
              {
                type: 'severe_absence',
                studentId: student._id,
                absenceCount: absences.length
              }
            );
          }
        }
      }
    } catch (error) {
      console.error('Failed to check absence patterns:', error);
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to check absence patterns');
    }
  }
};
