const express = require("express");
const router = express.Router();
const storyController = require("../controller/story")
const { likeStory } = require("../controller/like.js");

const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken,storyController.createStory)
router.get("/getById/:userId", storyController.getStoryById);
router.put("/update/:id", verifyToken,storyController.editStory);
router.put("/like/:id", verifyToken, likeStory);
router.get("/getAll",storyController.getStories);

module.exports = router;