"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Company = mongoose.model("Company", {
    title: String,
    account_id: Number,
    atAGlance: String,
    about: String,
    logo: String,
    lat: Number,
    lng: Number,
    size: String,
    website: String,
    members: [Object],
    pictures: [Object],
    jobs: [Object]
});
module.exports = Company;
