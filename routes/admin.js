const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

//Protect all admin routes with both authenticate + authorize('admin')
router.use(authenticate, authorize('admin'));

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;