const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: String,
  item: String,
});

const BlogDraftSchema = new mongoose.Schema(
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
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("draft", BlogDraftSchema);
