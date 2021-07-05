"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Article = mongoose.model("Article", {
    title: String,
    description: String,
    tags: [String],
    status: String,
    createDate: String,
    persianCreateDate: String,
    files: [Object],
    creatorId: String,
    insGroupCodes: [String],
    zones: [String],
    creatorName: String,
    author: String,
    source: String,
    articleDate: String,
    classification: Number,
    comments: [Object]
});
module.exports = Article;
