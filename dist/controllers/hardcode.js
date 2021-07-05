"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardCodeController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const hardcode_1 = require("../models/hardcode");
const AccessGroup = require('../models/accessGroup');
const Resource = require('../models/resource');
var ObjectId = require('mongoose').Types.ObjectId;
class HardCodeController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getClassifications() {
        const data = await hardcode_1.Classification.find({});
        return data;
    }
    async getClassification(Id) {
        const data = await hardcode_1.Classification.findById(Id);
        return data;
    }
    async upsertClassification(id, title, rank, dataSources) {
        const obj = ({
            id: id,
            title: title,
            rank: rank,
        });
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await hardcode_1.Classification.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async deleteClassification(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await hardcode_1.Classification.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
}
exports.HardCodeController = HardCodeController;
