import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { ResourceAccess } from '../models/accessGroup';
import { Classification } from '../models/hardcode';
const AccessGroup = require('../models/accessGroup');
const Resource = require('../models/resource');
var ObjectId = require('mongoose').Types.ObjectId;



export class HardCodeController extends RESTDataSource {
    constructor() {
        super()
    }

    async getClassifications() {
        const data = await Classification.find({});

        return data
    }

    async getClassification(Id: string) {
        const data = await Classification.findById(Id);
        return data
    }

    async upsertClassification(id: string, title: string, rank: number,
        dataSources: any) {

        const obj = ({
            id: id,
            title: title,
            rank: rank,

        });

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await Classification.findOneAndUpdate(
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


    async deleteClassification(id: string) {
        try {
            const filter = { _id: new ObjectId(id) }
            const upsertedObj = await Classification.find(
                filter,

            ).remove()

            return id;
        }
        catch (err) {
            return null;
        }

    }


}
