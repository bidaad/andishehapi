export {}
const mongoose = require('mongoose');

const Zone = mongoose.model("Zones", {
    title: String,
  }, "zones");


module.exports = Zone;