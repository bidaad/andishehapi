"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const InsGroup = mongoose.model("InsGroup", {
    code: Number,
    title: String,
    parentCode: Number
}, "insGroups");
module.exports = InsGroup;
