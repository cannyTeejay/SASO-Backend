/**
 * FAQ Service - Handles frequently asked questions management
 */
const FAQ = require('../models/FAQ');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports = {
  /**
   * Creates a new FAQ entry
   * @param {string} question - FAQ question
   * @param {string} response - FAQ answer
   * @param {string} createdBy - ID of user creating the FAQ
   * @returns {Promise<Object>} Created FAQ
   * @throws {Error} If creator not found or creation fails
   */
  async createFAQ(question, response, createdBy) {
    try {
      // Verify creator exists and is authorized (tutor or admin)
      const creator = await User.findById(createdBy);
      if (!creator || !['Tutor', 'Admin'].includes(creator.role)) {
        throw new ErrorHandler(403, 'Only tutors and admins can create FAQs');
      }

      // Create new FAQ
      const faq = new FAQ({
        question,
        response,
        createdBy
      });

      await faq.save();
      return faq;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to create FAQ');
    }
  },

  /**
   * Gets FAQs with optional search filter
   * @param {string} searchQuery - Optional search term
   * @returns {Promise<Array>} List of FAQs
   * @throws {Error} If retrieval fails
   */
  async getFAQs(searchQuery = '') {
    try {
      let query = {};
      
      if (searchQuery) {
        query.$or = [
          { question: { $regex: searchQuery, $options: 'i' } },
          { response: { $regex: searchQuery, $options: 'i' } }
        ];
      }

      return await FAQ.find(query)
        .populate('createdBy', 'first_name last_name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new ErrorHandler(500, 'Failed to retrieve FAQs');
    }
  },

  /**
   * Updates an FAQ entry
   * @param {string} faqId - ID of FAQ to update
   * @param {Object} updates - Fields to update (question, response)
   * @param {string} updatedBy - ID of user updating the FAQ
   * @returns {Promise<Object>} Updated FAQ
   * @throws {Error} If FAQ not found, unauthorized, or update fails
   */
  async updateFAQ(faqId, updates, updatedBy) {
    try {
      // Verify user is authorized (tutor or admin)
      const user = await User.findById(updatedBy);
      if (!user || !['Tutor', 'Admin'].includes(user.role)) {
        throw new ErrorHandler(403, 'Only tutors and admins can update FAQs');
      }

      // Find and update FAQ
      const faq = await FAQ.findByIdAndUpdate(
        faqId,
        {
          ...updates,
          updatedBy,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!faq) {
        throw new ErrorHandler(404, 'FAQ not found');
      }

      return faq;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || 'Failed to update FAQ');
    }
  }
};
