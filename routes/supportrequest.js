const express = require('express');
const router = express.Router();
const supportrequestController = require('../controllers/supportrequestController');

router.post('/', supportrequestController.createSupportRequest);
router.get('/', supportrequestController.getAllSupportRequests);
router.get('/:id', supportrequestController.getSupportRequestById);
router.put('/:id', supportrequestController.updateSupportRequest);
router.delete('/:id', supportrequestController.deleteSupportRequest);

module.exports = router;