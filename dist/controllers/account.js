"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const jsonwebtoken_1 = require("jsonwebtoken");
const Account = require('../models/account');
const config_1 = require("../config");
var ObjectId = require('mongoose').Types.ObjectId;
class AccountController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getAccounts(pageNo, pageSize, filterText, sortType, sortkey) {
        const data = await Account.find({
            $or: [
                { fullName: { $regex: '.*' + filterText + '.*' } },
                { username: { $regex: '.*' + filterText + '.*' } },
            ]
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        const totalCount = await Account.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async getAccountById(Id) {
        const data = await Account.findById(Id);
        return data;
    }
    async getCurrentAccount(account_id) {
        const user = await Account.findOne({ account_id: account_id });
        return user;
    }
    async login(username, password, dataSources) {
        const user = await Account.findOne({ username: username });
        if (!user)
            return null;
        var CryptoJS = require("crypto-js");
        const decryptedPass = CryptoJS.AES.decrypt(user.password, config_1.SECRET_KEY_FOR_ENCRYPTION).toString(CryptoJS.enc.Utf8);
        //console.log('plain password=' + password);
        //console.log(encryptedPass);
        //console.log('db pass=' + user.password);
        const valid = decryptedPass === password;
        if (!valid)
            return null;
        //save last login date
        user.lastLoginDate = new Date();
        await user.save();
        const accessToken = jsonwebtoken_1.sign({ account_id: user.account_id }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
        dataSources.res.cookie('access-token', accessToken);
        return user;
    }
    async logout(dataSources) {
        try {
            dataSources.res.cookie('access-token', '');
            return true;
        }
        catch {
            return false;
        }
    }
    async createAccount(email, password, mobile) {
        const account = new Account({ email: email, password: password, mobile: mobile });
        await account.save();
        return account;
    }
    async changePassword(account_id, oldPassword, newPassword) {
        const account = await Account.findOne({ account_id: account_id });
        var CryptoJS = require("crypto-js");
        const decryptedPass = CryptoJS.AES.decrypt(account.password, config_1.SECRET_KEY_FOR_ENCRYPTION).toString(CryptoJS.enc.Utf8);
        console.log(decryptedPass);
        const valid = decryptedPass === oldPassword;
        if (!valid)
            return { result: false, message: 'کلمه عبور فعلی معتبر نیست' };
        const encryptedPass = CryptoJS.AES.encrypt(newPassword, config_1.SECRET_KEY_FOR_ENCRYPTION).toString();
        account.password = encryptedPass;
        await account.save();
        return { result: true, message: 'کلمه عبور با موفقیت تغییر کرد' };
    }
    async upsertAccount(id, username, fullName, password, savedPassword, isActive, dataSources) {
        const createDate = new Date().toString();
        var CryptoJS = require("crypto-js");
        const encryptedPass = CryptoJS.AES.encrypt(password, config_1.SECRET_KEY_FOR_ENCRYPTION).toString();
        const obj = ({
            id: id,
            username: username,
            fullName: fullName,
            password: encryptedPass,
            isActive: isActive,
            createDate: createDate,
        });
        if (id !== null) { //is update
            //delete obj.createDate
        }
        if (password === savedPassword)
            delete obj.password;
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await Account.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async deleteAccount(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await Account.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
}
exports.AccountController = AccountController;
