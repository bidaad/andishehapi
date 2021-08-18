export { }
const mongoose = require('mongoose');

const UserLog = mongoose.model("UserLog", {
    userId: Number,
    logDate: Date,
    action: String
}, "userLogs");



module.exports = UserLog;