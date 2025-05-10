const express = require('express');
const router = express.Router();
const lecturercourseController = require('../controllers/lecturercourseController');
const authenticate = require('../middleware/auth.middleware'); // Ensure authentication
const authorize = require('../middleware/role.middleware'); // Ensure authorization

//router.use(authenticate, authorize('lecturer'));

router.post('/', lecturercourseController.createLecturerCourse);
router.get('/', lecturercourseController.getAllLecturerCourses);
router.get('/:id', lecturercourseController.getLecturerCourseById);
router.put('/:id', lecturercourseController.updateLecturerCourse);
router.delete('/:id', lecturercourseController.deleteLecturerCourse);

module.exports = router;