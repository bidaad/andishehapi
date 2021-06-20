"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose = require('mongoose');
exports.Ticket = mongoose.model("Ticket", {
    title: String,
    description: String,
    date: Date,
    status: String,
    account_id: Number
});
module.exports = exports.Ticket;
