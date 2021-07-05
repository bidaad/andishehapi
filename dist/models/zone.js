"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Zone = mongoose.model("Zones", {
    title: String,
}, "zones");
module.exports = Zone;
