import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { AccountController } from './controllers/account';
import { TicketController } from './controllers/tickets';
const Account = require('./models/account');

export class MainConfig extends RESTDataSource {
  account_id: number;
  constructor() {
    super()
    this.account_id = 2
  }

  incAccountId(){
    this.account_id = this.account_id + 1;
  }
  
}

export const dataSources = () => ({ 
  mainConfig: new MainConfig(),
  accountController: new AccountController(),
  ticketController: new TicketController()
})
