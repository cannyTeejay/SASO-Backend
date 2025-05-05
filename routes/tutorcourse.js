const express = require('express');
const router = express.Router();
const tutorcourseController = require('../controllers/tutorcourseController');

router.post('/', tutorcourseController.createTutorCourse);
router.get('/', tutorcourseController.getAllTutorCourses);
router.get('/:id', tutorcourseController.getTutorCourseById);
router.put('/:id', tutorcourseController.updateTutorCourse);
router.delete('/:id', tutorcourseController.deleteTutorCourse);

module.exports = router;