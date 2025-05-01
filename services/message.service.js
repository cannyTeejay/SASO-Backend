/**
 * Message Service - Handles user messaging system
 */
const Message = require('../models/Message');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');
const { createNotification } = require('./notification.service');

module.exports = {
  /**
   * Sends a message between users
   * @param {string} senderId - ID of the sender
   * @param {string} receiverId - ID of the recipient
   * @param {string} subject - Message subject
   * @param {string} content - Message content
   * @returns {Promise<Object>} Created message
   * @throws {Error} If sender or receiver not found, or creation fails
   */
  async sendMessage(senderId, receiverId, subject, content) {
    try {
      // Verify sender exists
      const sender = await User.findById(senderId);
      if (!sender) {
        throw new ErrorHandler(404, 'Sender not found');
      }

      // Verify receiver exists
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        throw new ErrorHandler(404, 'Recipient not found');
      }

      // Prevent sending to self
      if (senderId.toString() === receiverId.toString()) {
        throw new ErrorHandler(400, 'Cannot send message to yourself');
      }

      // Create new message
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        subject,
        content
      });

      await message.save();
      
      // Notify recipient
      await createNotification(
        receiverId,
        'New Message Received',
        `You have a new message from ${sender.first_name} ${sender.last_name}`,
        {
          messageId: message._id,
          senderId: sender._id
        }
      );

      return message;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to send message');
    }
  },

  /**
   * Gets message thread between two users
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @returns {Promise<Array>} Message thread in chronological order
   * @throws {Error} If either user not found or retrieval fails
   */
  async getMessageThread(userId1, userId2) {
    try {
      // Verify both users exist
      const [user1, user2] = await Promise.all([
        User.findById(userId1),
        User.findById(userId2)
      ]);

      if (!user1 || !user2) {
        throw new ErrorHandler(404, 'One or both users not found');
      }

      return await Message.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 }
        ]
      })
      .populate('sender receiver', 'first_name last_name')
      .sort({ createdAt: 1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve message thread');
    }
  },

  /**
   * Gets inbox for a user
   * @param {string} userId - ID of the user
   * @returns {Promise<Array>} List of received messages
   * @throws {Error} If user not found or retrieval fails
   */
  async getInbox(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      return await Message.find({ receiver: userId })
        .populate('sender', 'first_name last_name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve inbox');
    }
  }
};
