import express from "express";
const router = express.Router();
const classController = require("../controllers/class.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, classController.createClass);
router.get("/", auth, classController.getAllClasses);
router.get("/:id", auth, classController.getClassById);
router.put("/:id", auth, classController.updateClass);
router.delete("/:id", auth, classController.deleteClass);

module.exports = router;