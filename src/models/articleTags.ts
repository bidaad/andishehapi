export {}
const mongoose = require('mongoose');

const ArticleTag = mongoose.model("ArticleTag", {
    title: String,
  }, "articleTags");


module.exports = ArticleTag;