import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
const Account = require('../models/account');


export class AccountController extends RESTDataSource {
  constructor() {
    super()
  }

  async getAccounts(pageNo: number) {
    const data = await Account.find({}, function (err, doc) {

    });
    console.log(data)
    return data
  }

  async createAccount(email: string, password: string, mobile: string) {
    const account = new Account({ email: email, password: password, mobile: mobile });
        await account.save();
        return account;
  }
}

// const dataSources = () => ({ accountController: new AccountController() })
// module.exports = dataSources