export{}
const mongoose = require('mongoose');

const Article = mongoose.model("Article", {
    title: String,
    description: String,
    tags: [String],
    status: String,
    createDate: Date,
    persianCreateDate: String,
    files: [Object],
    creatorId: Number,
    insGroupCodes: [String],
    zones: [String],
    creatorName: String,
    author: String,
    source: String,
    articleDate: Date,
    classification: Number,
    comments: [Object],
    articleType: String,
    changeLogs: [Object]
  });


module.exports = Article;