import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { ResourceAccess } from '../models/accessGroup';
const AccessGroup = require('../models/accessGroup');
const Resource = require('../models/resource');
var ObjectId = require('mongoose').Types.ObjectId;

export interface AccessGroup {
    _id?: string,
    id?: string,
    title: string
    resourceAccesses: ResourceAccess[]
}
export interface Resource {
    _id?: string,
    id?: string,
    title: string
    engTitle: string
    path: string
}


export class AccessGroupsController extends RESTDataSource {
    constructor() {
        super()
    }

    async getAccessGroups(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String, dataSources: any) {

        const data = await AccessGroup.find({
            title: { $regex: '.*' + filterText + '.*' }
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize)
            ;

        const totalCount = await AccessGroup.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data }
    }


    async upsertAccessGroup(id: string, title: string, resourceAccesses: ResourceAccess[],
        dataSources: any) {

        const obj: AccessGroup = {
            id: id,
            title: title,
            resourceAccesses: resourceAccesses,
        };

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await AccessGroup.findOneAndUpdate(
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

    async getAccessGroup(Id: string) {
        const data = await AccessGroup.findById(Id);

        return data
    }


    //Resources
    async getResources(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String, dataSources: any) {

        const data = await Resource.find({
            title: { $regex: '.*' + filterText + '.*' }
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize)
            ;

        const totalCount = await Resource.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data }
    }


    async upsertResource(id: string, title: string, engTitle: string, path: string,
        dataSources: any) {

        const obj: Resource = {
            id: id,
            title: title,
            engTitle: engTitle,
            path: path,
        };

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await Resource.findOneAndUpdate(
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

    async getResource(Id: string) {
        const data = await Resource.findById(Id);

        return data
    }

    async deleteAccessGroup(id: string) {
        try {
          const filter = { _id: new ObjectId(id) }
          const upsertedObj = await AccessGroup.find(
            filter,
    
          ).remove()
    
          return id;
        }
        catch (err) {
          return null;
        }
    
      }


}
