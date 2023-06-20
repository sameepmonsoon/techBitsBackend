const Bloglikes = require("../models/blogReaction.js");

exports.like = async (req, res) => {
  try {
    const userBlogId = req.body.blogId;
    const userId = req.body.userId;
    const creatorId = req.body.creatorId;
    console.log("this is user id", userId);
    let findBlog = await Bloglikes.findOne({ blogId: userBlogId });

    if (!findBlog) {
      findBlog = new Bloglikes({
        userId: creatorId,
        blogId: userBlogId,
        likes: [userId],
      });
      await findBlog.save();
      res
        .status(200)
        .json({ updatedlikeComment: findBlog, message: "Success liked" });
    } else {
      const existingIndex = findBlog.likes.indexOf(userId);

      if (existingIndex !== -1) {
        findBlog.likes = findBlog.likes.filter((item) => item !== userId);
        await findBlog.save();
        res.status(200).json({
          updatedlikeComment: findBlog,
          message: "Like removed",
          liked: false,
        });
      } else {
        findBlog.likes.push(userId);
        await findBlog.save();
        res.status(200).json({
          updatedlikeComment: findBlog,
          message: "Liked",
          liked: true,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to like/dislike the blog post" });
  }
};
exports.getAllLike = async (req, res) => {
  try {
    const blogId = req.body.blogId;
    const findAll = await Bloglikes.find({ blogId: blogId });
    if (findAll) {
      res.status(200).json({ findAll, message: "Success" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve likes for the blog" });
  }
};
