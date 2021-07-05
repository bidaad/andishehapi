const mongoose = require('mongoose');

export const Classification = mongoose.model("Classification", {
    title: String,
    rank: Number,
  }, "classifications");


