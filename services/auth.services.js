/**
 * Authentication Service - Handles user authentication and authorization
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

module.exports = {
  /**
   * Authenticates user credentials and generates JWT token
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication token and user data
   * @throws {Error} If credentials are invalid
   */
  async authenticateUser(email, password) {
    // Find user by email including password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    
    // Verify user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    return {
      token,
      user: {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }
    };
  },

  /**
   * Middleware factory for role-based authorization
   * @param {string} requiredRole - Required role to access resource
   * @returns {Function} Express middleware function
   */
  authorizeRole(requiredRole) {
    return (req, res, next) => {
      // Check if user has the required role
      if (req.user.role !== requiredRole) {
        throw new Error(`Unauthorized - Requires ${requiredRole} role`);
      }
      next();
    };
  }
};
