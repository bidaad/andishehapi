export{}
const mongoose = require('mongoose');

const Article = mongoose.model("Article", {
    title: String,
    description: String,
    tags: [String],
    status: String,
    createDate: String,
    files: [String],
    creatorId: String,
    insGroupCodes: [String]
  });


module.exports = Article;