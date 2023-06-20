const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: String,
  item: String,
});

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId: {
      type: String,
      required: true,
    },
    categoryList: {
      type: [CategorySchema], // Array of CategorySchema objects
      required: true,
      default: [],
    },
    selectedPhoto: { type: String, default: "" },
    titleContent: {
      type: String,
      required: true,
    },
    editorContent: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    disLikes: {
      type: Array,
      default: [],
    },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogs", BlogSchema);
