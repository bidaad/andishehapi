"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classification = void 0;
const mongoose = require('mongoose');
exports.Classification = mongoose.model("Classification", {
    title: String,
    rank: Number,
}, "classifications");
