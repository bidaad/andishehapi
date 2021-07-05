"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const AccessGroup = mongoose.model("AccessGroup", {
    title: String,
    resourceAccesses: [Object],
}, "accessGroups");
module.exports = AccessGroup;
