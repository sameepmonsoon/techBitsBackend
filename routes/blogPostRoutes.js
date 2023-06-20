const express = require("express");
const {
  createBlogPost,
  getAllBlogPosts,
  getUserPosts,
  likeDislikeBlog,
  createBlogDraft,
  getBlogDraft,
  deleteBlogPost,
  deleteBlogDraft,
} = require("../controllers/blogPostController.js");

const router = express.Router();

// Create a Tweet
router.post("/create", createBlogPost);
router.post("/:id/comment", createBlogPost);
router.post("/createDraft", createBlogDraft);
router.get("/getDraft/:id", getBlogDraft);
router.get("/getAll", getAllBlogPosts);
router.get("/timeline/:id", getUserPosts);
router.post("/:id/like", likeDislikeBlog);
router.delete("/deleteBlog/:id", deleteBlogPost);
router.delete("/deleteBlogDraft/:id", deleteBlogDraft);

module.exports = router;
