const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/star", userController.addStarredQuestion);
router.post("/unstar", userController.removeStarredQuestion);
router.get("/starred/:userId", userController.getStarredQuestions);
router.get("/users", userController.getUsers);
router.get("/profile/:userId", userController.getUserDetails);

module.exports = router;
