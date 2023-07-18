const express = require("express");
const {
  signin,
  signup,
  deleteUser,
  bookmark,
  follow,
  getAllBookmark,
  updateProfile,
  allUser,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", signup);
router.delete("/delete/:id", deleteUser);
router.post("/signin", signin);
router.put("/bookmark", bookmark);
router.post("/getBookmark", getAllBookmark);
router.put("/follow", follow);
router.put("/updateProfile", updateProfile);
router.get("/allUser", allUser);

module.exports = router;
