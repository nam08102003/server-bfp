const mongoose = require("mongoose");

const Blogs = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    idTypeBlog: {
      type: Number,
      default: 43,
    },
    image: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "",
    },
    countRead: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: [],
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const BlogsModel = mongoose.model("Blogs", Blogs);

module.exports = BlogsModel;
