/**
 * User Service - Handles user management and profile operations
 */
const User = require('../models/User');
const Department = require('../models/Department');
const { ErrorHandler } = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Creates a new user account
   * @param {Object} userData - User data (email, password, role, etc)
   * @param {string} creatorId - ID of admin creating the user
   * @returns {Promise<Object>} Created user (without password)
   * @throws {Error} If validation fails or user already exists
   */
  async createUser(userData, creatorId) {
    try {
      // Verify creator is admin
      const creator = await User.findById(creatorId);
      if (!creator || creator.role !== 'Admin') {
        throw new ErrorHandler(403, 'Only admins can create users');
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new ErrorHandler(400, 'Email already in use');
      }

      // Validate required fields
      if (!userData.email || !userData.password || !userData.role) {
        throw new ErrorHandler(400, 'Missing required fields');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const user = new User({
        ...userData,
        password: hashedPassword,
        createdBy: creatorId
      });

      await user.save();
      
      // Return user without password
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create user');
    }
  },

  /**
   * Updates user profile information
   * @param {string} userId - User ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user
   * @throws {Error} If user not found or validation fails
   */
  async updateUserProfile(userId, updates) {
    try {
      // Find user and validate
      const user = await User.findById(userId);
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      // Prevent certain fields from being updated this way
      const restrictedFields = ['role', 'email', 'password'];
      restrictedFields.forEach(field => {
        if (updates[field]) {
          throw new ErrorHandler(403, `Cannot update ${field} through this endpoint`);
        }
      });

      // Apply updates
      Object.keys(updates).forEach(key => {
        user[key] = updates[key];
      });

      await user.save();
      
      // Return user without password
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to update profile');
    }
  },

  /**
   * Updates user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if successful
   * @throws {Error} If user not found or password invalid
   */
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Find user with password field
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new ErrorHandler(401, 'Current password is incorrect');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return true;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to update password');
    }
  },

  /**
   * Gets user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   * @throws {Error} If user not found
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId)
        .populate('department', 'departmentName')
        .select('-password');
      
      if (!user) {
        throw new ErrorHandler(404, 'User not found');
      }

      return user;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve profile');
    }
  },

  /**
   * Lists users with optional filters (admin only)
   * @param {Object} filters - Filters (role, department, etc)
   * @returns {Promise<Array>} List of users
   * @throws {Error} If unauthorized or retrieval fails
   */
  async listUsers(filters = {}) {
    try {
      let query = {};
      
      // Apply role filter if specified
      if (filters.role) {
        query.role = filters.role;
      }
      
      // Apply department filter if specified
      if (filters.department) {
        query.department = filters.department;
      }

      // Apply search term if specified
      if (filters.search) {
        query.$or = [
          { first_name: { $regex: filters.search, $options: 'i' } },
          { last_name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } }
        ];
      }

      return await User.find(query)
        .populate('department', 'departmentName')
        .select('-password')
        .sort({ last_name: 1 });
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to retrieve users');
    }
  }
};
