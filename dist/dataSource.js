"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSources = exports.MainConfig = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const account_1 = require("./controllers/account");
const tickets_1 = require("./controllers/tickets");
const company_1 = require("./controllers/company");
const article_1 = require("./controllers/article");
const insGroup_1 = require("./controllers/insGroup");
class MainConfig extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.account_id = 2;
    }
    incAccountId() {
        this.account_id = this.account_id + 1;
    }
}
exports.MainConfig = MainConfig;
const dataSources = ({ req, res }) => ({
    req,
    res,
    mainConfig: new MainConfig(),
    accountController: new account_1.AccountController(),
    ticketController: new tickets_1.TicketController(),
    companyController: new company_1.CompanyController(),
    articleController: new article_1.ArticleController(),
    insGroupController: new insGroup_1.InsGroupController(),
});
exports.dataSources = dataSources;
