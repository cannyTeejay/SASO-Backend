const express = require('express');
const router = express.Router();
const lecturercourseController = require('../controllers/lecturercourseController');

router.post('/', lecturercourseController.createLecturerCourse);
router.get('/', lecturercourseController.getAllLecturerCourses);
router.get('/:id', lecturercourseController.getLecturerCourseById);
router.put('/:id', lecturercourseController.updateLecturerCourse);
router.delete('/:id', lecturercourseController.deleteLecturerCourse);

module.exports = router;