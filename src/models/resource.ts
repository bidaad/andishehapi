export{}
const mongoose = require('mongoose');

const Resource = mongoose.model("Resource", {
    title: String,
    engTitle: String,
    path: String,
  }, "resources");


module.exports = Resource;