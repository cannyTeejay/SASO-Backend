/**
 * Support Service - Handles help desk/support ticket operations
 */
const Support = require('../models/Support');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');
const { createNotification } = require('./notification.service');

module.exports = {
  /**
   * Creates a new support ticket
   * @param {string} userId - ID of the user creating the ticket
   * @param {string} subject - Ticket subject
   * @param {string} query - Support question/issue
   * @returns {Promise<Object>} Created support ticket
   * @throws {Error} If user not found or creation fails
   */
  async createSupportTicket(userId, subject, query) {
    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      // Create new ticket
      const ticket = new Support({
        user: userId,
        subject,
        query,
        status: 'open'
      });

      await ticket.save();
      
      // Notify all admins about new ticket
      const admins = await User.find({ role: 'Admin' });
      for (const admin of admins) {
        await createNotification(
          admin._id,
          'New Support Ticket',
          `New support ticket from ${user.first_name} ${user.last_name}: ${subject}`,
          {
            ticketId: ticket._id,
            userId: user._id
          }
        );
      }

      return ticket;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create support ticket');
    }
  },

  /**
   * Resolves a support ticket
   * @param {string} ticketId - ID of the ticket to resolve
   * @param {string} response - Resolution response
   * @param {string} resolvedBy - ID of admin resolving the ticket
   * @returns {Promise<Object>} Updated support ticket
   * @throws {Error} If ticket not found, unauthorized, or update fails
   */
  async resolveSupportTicket(ticketId, response, resolvedBy) {
    try {
      // Verify ticket exists
      const ticket = await Support.findById(ticketId);
      if (!ticket) {
        throw new ErrorHandler(404, 'Support ticket not found');
      }

      // Verify resolver is admin
      const admin = await User.findById(resolvedBy);
      if (!admin || admin.role !== 'Admin') {
        throw new ErrorHandler(403, 'Only admins can resolve tickets');
      }

      // Update ticket
      ticket.response = response;
      ticket.status = 'resolved';
      ticket.resolvedBy = resolvedBy;
      ticket.resolvedAt = new Date();
      await ticket.save();

      // Notify user about resolution
      await createNotification(
        ticket.user,
        'Support Ticket Resolved',
        `Your support ticket "${ticket.subject}" has been resolved`,
        {
          ticketId: ticket._id
        }
      );

      return ticket;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to resolve support ticket');
    }
  },

  /**
   * Gets support tickets with optional filters
   * @param {Object} filters - Filters (status, userId, etc)
   * @returns {Promise<Array>} List of support tickets
   * @throws {Error} If retrieval fails
   */
  async getSupportTickets(filters = {}) {
    try {
      let query = {};
      
      // Apply status filter if specified
      if (filters.status) {
        query.status = filters.status;
      }
      
      // Apply user filter if specified
      if (filters.userId) {
        query.user = filters.userId;
      }

      // Apply search term if specified
      if (filters.search) {
        query.$or = [
          { subject: { $regex: filters.search, $options: 'i' } },
          { query: { $regex: filters.search, $options: 'i' } }
        ];
      }

      return await Support.find(query)
        .populate('user', 'first_name last_name email')
        .populate('resolvedBy', 'first_name last_name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve support tickets');
    }
  }
};
