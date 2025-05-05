const express = require('express');
const router = express.Router();
const studentcourseController = require('../controllers/studentcourseController');

router.post('/', studentcourseController.createStudentCourse);
router.get('/', studentcourseController.getAllStudentCourses);
router.get('/:id', studentcourseController.getStudentCourseById);
router.put('/:id', studentcourseController.updateStudentCourse);
router.delete('/:id', studentcourseController.deleteStudentCourse);

module.exports = router;