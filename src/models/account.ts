const mongoose = require('mongoose');

const Account = mongoose.model("Account", {
    account_id: Number,
    fullName: String,
    username: String,
    password: String,
    isActive: Boolean,
    lastLoginDate: String,
    createDate: String,
  });


module.exports = Account;