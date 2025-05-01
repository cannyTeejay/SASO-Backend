/**
 * Authentication Service - Handles user authentication and authorization
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Authenticates user credentials and generates JWT token
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication token and user data
   * @throws {Error} If credentials are invalid or user not found
   */
  async authenticateUser(email, password) {
    try {
      // Find user by email including password field (normally excluded)
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new ErrorHandler(401, 'Invalid credentials');
      }

      // Verify password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ErrorHandler(401, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          role: user.role,
          email: user.email 
        },
        config.secret,
        { expiresIn: config.jwtExpiration }
      );

      // Return token and basic user info
      return {
        token,
        user: {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          department: user.department
        }
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Authentication failed');
    }
  },

  /**
   * Middleware factory for role-based authorization
   * @param {string|Array} requiredRoles - Required role(s) to access resource
   * @returns {Function} Express middleware function
   */
  authorizeRoles(...requiredRoles) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          throw new ErrorHandler(401, 'Authentication required');
        }

        // Check if user has any of the required roles
        if (!requiredRoles.includes(req.user.role)) {
          throw new ErrorHandler(403, `Access forbidden. Required roles: ${requiredRoles.join(', ')}`);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
};
