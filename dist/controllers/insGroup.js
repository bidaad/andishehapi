"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsGroupController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const InsGroup = require('../models/insGroup');
var ObjectId = require('mongoose').Types.ObjectId;
class InsGroupController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getInsGroups() {
        const data = await InsGroup.find();
        //console.log('hhhhhhhh')
        return data;
    }
    async save(insGroupsArray) {
        const data = await InsGroup.deleteMany();
        for (let i = 0; i < insGroupsArray.length; i++) {
            const element = insGroupsArray[i];
            const newInsGroup = new InsGroup(element);
            await newInsGroup.save();
        }
        return true;
    }
}
exports.InsGroupController = InsGroupController;
