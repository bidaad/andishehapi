import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
const Ticket = require('../models/tickets');


export class TicketController extends RESTDataSource {
    constructor() {
        super()
    }

    async getTickets(pageNo: number) {
        const data = await Ticket.find({});
        
        return data
    }

    async createTicket(title: string, description: string, account_id: number) {
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
