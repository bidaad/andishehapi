export {}
const mongoose = require('mongoose');

const ArticleStatus = mongoose.model("ArticleStatus", {
    title: String,
  }, "articleStatuses");


module.exports = ArticleStatus;