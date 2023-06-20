const express = require("express");
const {
  signin,
  signup,
  deleteUser,
  bookmark,
  follow,
  getAllBookmark,
  updateProfile,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", signup);
router.delete("/delete/:id", deleteUser);
router.post("/signin", signin);
router.put("/bookmark", bookmark);
router.post("/getBookmark", getAllBookmark);
router.put("/follow", follow);
router.put("/updateProfile", updateProfile);

module.exports = router;
