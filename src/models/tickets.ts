export{}
const mongoose = require('mongoose');

export const Ticket = mongoose.model("Ticket", 
{ 
    title: String,
    description: String,
    date: Date,
    status: String,
    account_id: Number

 }
);


module.exports = Ticket;