const Blog = require("../models/blogPost.js");
const Draft = require("../models/blogDraft.js");

exports.createBlogPost = async (req, res, next) => {
  try {
    const { userId, comment } = req.body;
    const { id } = req.params;

    const commentBlog = await Blog.findById(id);
    const blogId = req.body.blogId;
    if (commentBlog && id) {
      const newComment = {
        userId,
        content: comment,
      };
      commentBlog.comments.push(newComment);
      const updatedBlogs = await commentBlog.save();
      const { comments } = updatedBlogs.toObject();
      res.status(200).json({ comments, message: "Published Successfully." });
    }
    if (!commentBlog && id) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blogId) {
      const findBlog = await Blog.findOneAndUpdate(
        { _id: blogId },
        {
          username: req.body.username,
          categoryList: req.body.categoryList,
          titleContent: req.body.titleContent,
          selectedPhoto: req.body.selectedPhoto,
          editorContent: req.body.editorContent,
        },
        { new: true }
      );
      res.status(200).json({ findBlog, message: "Blog Updated Successfully." });
    }
    if (!blogId) {
      const newBlog = new Blog({
        username: req.body.username,
        userId: req.body.userId,
        categoryList: req.body.categoryList,
        titleContent: req.body.titleContent,
        selectedPhoto: req.body.selectedPhoto,
        editorContent: req.body.editorContent,
      });

      const savedBlog = await newBlog.save();
      res.status(200).json({ savedBlog, message: "Published Successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

exports.getAllBlogPosts = async (req, res) => {
  try {
    const getAllBlog = await Blog.find();
    res.status(200).json({
      getAllBlog,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};
exports.getUserPosts = async (req, res) => {
  try {
    const userPost = await Blog.find({ userId: req.params.id });
    console.log(userPost);
    res.status(200).json({
      userPost,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};
exports.likeDislikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId;

    const likeBlog = await Blog.findById(blogId);

    if (!likeBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const existingLikeIndex = likeBlog.likes.findIndex(
      (like) => like === userId
    );
    // to remove like if it already exists
    if (existingLikeIndex !== -1) {
      likeBlog.likes.splice(existingLikeIndex, 1);
    } else {
      likeBlog.likes.push(userId);
    }

    await likeBlog.save();

    const updatedLikeBlog = await Blog.findById(blogId);

    res.status(200).json({
      updatedLikeBlog,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to like/dislike the blog post" });
  }
};

// for draft
exports.createBlogDraft = async (req, res) => {
  try {
    const getAllBlogDraft = await Draft.find({ userId: req.body.userId });
    const checkSameDraft = await Draft.find({ _id: req.body?.id });
    console.log(checkSameDraft);
    if (getAllBlogDraft.length > 4) {
      res.status(500).json({ error: "Can't save more than 5 drafts." });
    } else {
      if (checkSameDraft.length > 0) {
        const updatedDraft = await Draft.findOneAndUpdate(
          { _id: req.body?.id },
          {
            $set: {
              username: req.body.username,
              userId: req.body.userId,
              categoryList: req.body.categoryList,
              titleContent: req.body.titleContent,
              selectedPhoto: req.body.selectedPhoto,
              editorContent: req.body.editorContent,
            },
          },
          { new: true }
        );

        console.log(updatedDraft);
        res
          .status(200)
          .json({ updatedDraft, message: "Draft updated Successfully." });
      } else {
        const newBlogDraft = new Draft({
          username: req.body.username,
          userId: req.body.userId,
          categoryList: req.body.categoryList,
          titleContent: req.body.titleContent,
          selectedPhoto: req.body.selectedPhoto,
          editorContent: req.body.editorContent,
        });
        console.log("indide server", newBlogDraft);
        const savedBlogDraft = await newBlogDraft.save();
        res
          .status(200)
          .json({ savedBlogDraft, message: "Draft saved Successfully." });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save as draft." });
  }
};

exports.getBlogDraft = async (req, res) => {
  try {
    const getAllBlogDraft = await Draft.find({ userId: req.params.id });
    res.status(200).json({
      getAllBlogDraft,
      message: "Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch drafts." });
  }
};

// delete

// delete post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log(blogId);
    console.log(blogId);
    const isPresent = Blog.findOne({ _id: blogId });
    if (isPresent != null) {
      await Blog.deleteOne({ _id: blogId });
      const allBlogsAfterDelete = await Blog.find();
      res.status(200).json({
        message: "Deleted",
        allBlogsAfterDelete,
        flag: true,
      });
    } else {
      console.log(err);
      res.status(500).json({ error: "Blog not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete." });
  }
};

// delete draft

exports.deleteBlogDraft = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId;
    console.log(blogId);
    console.log(blogId);
    const isPresent = Draft.findOne({ _id: blogId });
    if (isPresent != null) {
      await Draft.deleteOne({ _id: blogId });
      const allBlogsAfterDelete = await Draft.find({ userId });
      res.status(200).json({
        message: "Deleted",
        allBlogsAfterDelete,
        flag: true,
      });
    } else {
      console.log(err);
      res.status(500).json({ error: "Blog not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete." });
  }
};
