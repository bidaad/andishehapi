"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const Ticket = require('../models/tickets');
class TicketController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getTickets(pageNo) {
        const data = await Ticket.find({});
        return data;
    }
    async createTicket(title, description, account_id) {
        const account = new Ticket({
            title: title,
            description: description,
            date: new Date(),
            status: "Created",
            account_id: account_id
        });
        await account.save();
        return account;
    }
}
exports.TicketController = TicketController;
