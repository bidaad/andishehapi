"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessGroupsController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const AccessGroup = require('../models/accessGroup');
const Resource = require('../models/resource');
var ObjectId = require('mongoose').Types.ObjectId;
class AccessGroupsController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getAccessGroups(pageNo, pageSize, filterText, sortType, sortkey, dataSources) {
        const data = await AccessGroup.find({
            title: { $regex: '.*' + filterText + '.*' }
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        const totalCount = await AccessGroup.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async upsertAccessGroup(id, title, resourceAccesses, dataSources) {
        const obj = {
            id: id,
            title: title,
            resourceAccesses: resourceAccesses,
        };
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await AccessGroup.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async getAccessGroup(Id) {
        const data = await AccessGroup.findById(Id);
        return data;
    }
    //Resources
    async getResources(pageNo, pageSize, filterText, sortType, sortkey, dataSources) {
        const data = await Resource.find({
            title: { $regex: '.*' + filterText + '.*' }
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        const totalCount = await Resource.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async upsertResource(id, title, engTitle, path, dataSources) {
        const obj = {
            id: id,
            title: title,
            engTitle: engTitle,
            path: path,
        };
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await Resource.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async getResource(Id) {
        const data = await Resource.findById(Id);
        return data;
    }
    async deleteAccessGroup(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await AccessGroup.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
}
exports.AccessGroupsController = AccessGroupsController;
