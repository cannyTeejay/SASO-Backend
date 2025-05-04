import express from 'express';
const attendanceController = require('../controllers/attendance.controller');

const router = express.Router();

router.post('createAttendance/', attendanceController.createAttendance);
router.get('getAllAttendance/', attendanceController.getAllAttendance);
router.get('getSpecificAttendance/:id', attendanceController.getAttendanceById);
router.put('updateAttendance/:id', attendanceController.updateAttendance);
router.delete('deleteSpecificAttendance/:id', attendanceController.deleteAttendance);
router.get('attendanceFilter/filter', attendanceController.getAttendanceByFilter);

module.exports = router;