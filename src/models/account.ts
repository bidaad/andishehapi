const mongoose = require('mongoose');

const Account = mongoose.model("Account", {
    email: String,
    account_id: Number,
    password: String,
    mobile: String,
    active: Boolean,
    challenge_code: String,
    verified: Boolean
  });


module.exports = Account;