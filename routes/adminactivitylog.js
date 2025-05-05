const express = require('express');
const router = express.Router();
const adminactivitylogController = require('../controllers/adminactivitylogController');

router.post('/', adminactivitylogController.createAdminActivityLog);
router.get('/', adminactivitylogController.getAllAdminActivityLogs);
router.get('/:id', adminactivitylogController.getAdminActivityLogById);
router.put('/:id', adminactivitylogController.updateAdminActivityLog);
router.delete('/:id', adminactivitylogController.deleteAdminActivityLog);

module.exports = router;