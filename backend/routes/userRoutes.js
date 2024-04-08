const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/star", userController.addStarredQuestion);
router.post("/unstar", userController.removeStarredQuestion);
router.get("/starred/:userId", userController.getStarredQuestions);
router.get("/users", userController.getUsers);
router.get("/profile/:userId", userController.getUserDetails);
router.put("/profile/update/:userId", userController.updateUserProfile);
router.post("/addFriend", userController.addFriend);
router.post("/removeFriend", userController.removeFriend);
router.get("/checkFriendship", userController.checkFriendship);
router.get("/friends/:userId", userController.fetchFriends);
router.post("/questionSolved", userController.addQuestionToSolved);
router.put("/:contestId/end", contestController.endContest);

module.exports = router;
