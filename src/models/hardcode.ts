const mongoose = require('mongoose');

export const Classification = mongoose.model("Classification", {
  title: String,
  rank: Number,
}, "classifications");

export const ArticleType = mongoose.model("ArticleType", {
  title: String,
}, "articleTypes");

export const ArticleStatus = mongoose.model("ArticleStatus", {
  title: String,
}, "articleStatuses");
