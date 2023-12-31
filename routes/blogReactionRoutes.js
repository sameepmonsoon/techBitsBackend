const express = require("express");
const {
  like,
  getAllLike,
} = require("../controllers/blogReactionController.js");

const router = express.Router();

router.post("/like", like);
router.post("/get", getAllLike);

module.exports = router;
