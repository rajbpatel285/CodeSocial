const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/star", userController.addStarredQuestion);
router.post("/unstar", userController.removeStarredQuestion);
router.get("/starred/:userId", userController.getStarredQuestions);

module.exports = router;
