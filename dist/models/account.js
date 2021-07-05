"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Account = mongoose.model("Account", {
    account_id: Number,
    fullName: String,
    username: String,
    password: String,
    isActive: Boolean,
    lastLoginDate: String,
    createDate: String,
    role: String,
    zone: String,
    accessGroups: [String],
    classification: String
});
module.exports = Account;
