"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ArticleStatus = mongoose.model("ArticleStatus", {
    title: String,
}, "articleStatuses");
module.exports = ArticleStatus;
