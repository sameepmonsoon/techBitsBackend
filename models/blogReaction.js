const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: String,
  user: String,
});

const BlogReactionSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true },
    userId: {
      type: String,
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogLike", BlogReactionSchema);
