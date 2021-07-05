import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { AccountController } from './controllers/account';
import { TicketController } from './controllers/tickets';
import { CompanyController } from './controllers/company';
import { JobseekerController } from './controllers/jobseeker';
import { ArticleController } from './controllers/article';
import { InsGroupController } from './controllers/insGroup';
import { AccessGroupsController } from './controllers/accessGroup';
import { HardCodeController } from './controllers/hardcode';

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


export const dataSources = ({req, res}:any) => ({
  req,
  res,
  mainConfig: new MainConfig(),
  accountController: new AccountController(),
  ticketController: new TicketController(),
  companyController: new CompanyController(),
  articleController: new ArticleController(),
  insGroupController: new InsGroupController(),
  accessGroupController: new AccessGroupsController(),  
  hardcodeController: new HardCodeController(),

})
