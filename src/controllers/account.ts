import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { sign } from 'jsonwebtoken'
import { ActionResult } from '../models/ActionResult'
const Account = require('../models/account');
import { ACCESS_TOKEN_SECRET, SECRET_KEY_FOR_ENCRYPTION } from "../config";
var ObjectId = require('mongoose').Types.ObjectId;


export class AccountController extends RESTDataSource {
  constructor() {
    super()
  }

  async getAccounts(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String) {
    
    const data = await Account.find({
      $or: [
        { fullName: { $regex: '.*' + filterText + '.*' } },
        { username: { $regex: '.*' + filterText + '.*' } },
      ]
    })
      .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
      .limit(pageSize)
      ;

    const totalCount = await Account.find().count();
    return { result: true, message: '', totalCount: totalCount, data: data }
  }

  
  async getAccountById(Id: string) {
    const data = await Account.findById(Id);
    return data
  }

  async getCurrentAccount(account_id) {
    const user = await Account.findOne({ account_id: account_id });

    return user
  }

  async login(username: string, password: string, dataSources: any) {
    const user = await Account.findOne({ username: username });

    if (!user)
      return null;

    var CryptoJS = require("crypto-js");
    const decryptedPass = CryptoJS.AES.decrypt(user.password, SECRET_KEY_FOR_ENCRYPTION).toString(CryptoJS.enc.Utf8);
    //console.log('plain password=' + password);

    //console.log(encryptedPass);
    //console.log('db pass=' + user.password);

    const valid = decryptedPass === password
    if (!valid)
      return null;

    //save last login date
    user.lastLoginDate = new Date();
    await user.save();

    const accessToken = sign({ account_id: user.account_id }, ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
    dataSources.res.cookie('access-token', accessToken)
    return user
  }

  async logout(dataSources: any) {
    try {
      dataSources.res.cookie('access-token', '')
      return true
    }
    catch {
      return false;
    }
  }

  async createAccount(email: string, password: string, mobile: string) {
    const account = new Account({ email: email, password: password, mobile: mobile });
    await account.save();
    return account;
  }

  async changePassword(account_id: string, oldPassword: string, newPassword: string) {
    const account = await Account.findOne({ account_id: account_id });

    var CryptoJS = require("crypto-js");
    const decryptedPass = CryptoJS.AES.decrypt(account.password, SECRET_KEY_FOR_ENCRYPTION).toString(CryptoJS.enc.Utf8);

    console.log(decryptedPass);

    const valid = decryptedPass === oldPassword
    if (!valid)
      return { result: false, message: 'کلمه عبور فعلی معتبر نیست' } as ActionResult;

    const encryptedPass = CryptoJS.AES.encrypt(newPassword, SECRET_KEY_FOR_ENCRYPTION).toString();
    account.password = encryptedPass;
    await account.save();
    return { result: true, message: 'کلمه عبور با موفقیت تغییر کرد' } as ActionResult;
  }

  async upsertAccount(id: string, username: string, fullName: string, password: string, savedPassword: string, isActive: boolean,
    dataSources: any) {

    const createDate = new Date().toString();

    var CryptoJS = require("crypto-js");
    const encryptedPass = CryptoJS.AES.encrypt(password, SECRET_KEY_FOR_ENCRYPTION).toString();

    const obj = ({
      id: id,
      username: username,
      fullName: fullName,
      password: encryptedPass,
      isActive: isActive,
      createDate: createDate,
    });

    if (id !== null) {//is update
      delete obj.createDate
    }

    if (password === savedPassword)
      delete obj.password

    const filter = { _id: new ObjectId(id) }
    const upsertedObj = await Account.findOneAndUpdate(
      filter,
      obj,
      {
        new: true, // Always returning updated work experiences.
        upsert: true, // By setting this true, it will create if it doesn't exist
        projection: {}, // without return _id and __v
      }
    )

    return upsertedObj;
  }

}
