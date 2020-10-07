const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    //the user who sent the request....
    blogUrl: {
      type: "String",
      required: true,
      unique: true,
    },
    blogHeading: {
      type: "String",
      required: true,
    },
    blogAuthor: {
      type: "String",
      required: true,
    },
    blogContent: {
      type: "String",
      required: true,
    },
    blogTags: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
