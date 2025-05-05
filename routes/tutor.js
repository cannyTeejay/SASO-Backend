const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

router.post('/', tutorController.createTutor);
router.get('/', tutorController.getAllTutors);
router.get('/:id', tutorController.getTutorById);
router.put('/:id', tutorController.updateTutor);
router.delete('/:id', tutorController.deleteTutor);

module.exports = router;