import express from "express";
const router = express.Router();
const messageController = require("../controllers/message.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, messageController.sendMessage);
router.get("/sent/:userID", auth, messageController.getSentMessages);
router.get("/received/:userID", auth, messageController.getReceivedMessages);

module.exports = router;