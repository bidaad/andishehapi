export{}
const mongoose = require('mongoose');

const Article = mongoose.model("Article", {
    title: String,
    description: String,
    tags: [String],
    status: String,
    createDate: String,
    files: [Object],
    creatorId: String,
    insGroupCode: Number
  });


module.exports = Article;