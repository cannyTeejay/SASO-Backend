import express from 'express';
const router = express.Router();
const faqController = require('../controllers/faq.controller');


router.get('/',faqController.getAllFAQs);

router.post('/',faqController.createFAQ);

router.get('/:id',faqController.getFAQById);

router.delete('/:id',faqController.deleteFAQ);

module.exports = router;