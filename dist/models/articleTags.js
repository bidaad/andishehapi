"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ArticleTag = mongoose.model("ArticleTag", {
    title: String,
}, "articleTags");
module.exports = ArticleTag;
