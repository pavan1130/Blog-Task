const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String, // Add author field
  date: { type: Date, default: Date.now }, // Add date field with default value
  image: String, // Add image field
});

module.exports = mongoose.model("Post", postSchema);
