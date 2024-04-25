const express = require("express");
const router = express.Router();
const authController = require ("../controller/user");
const verifyToken = require("../middleware/verifyToken");
const {
  bookmarkStory,
  getAllBookmarks,
} = require("../controller/bookmark.js");


router.post("/register",authController.registerUser);
router.post("/login",authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/load/:username", verifyToken, authController.loadUser);

router.post("/bookmark/:id", verifyToken, bookmarkStory);
router.get("/bookmarks/:userId", verifyToken, getAllBookmarks);

module.exports= router;
