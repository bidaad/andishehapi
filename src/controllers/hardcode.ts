import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { ResourceAccess } from '../models/accessGroup';
import { ArticleStatus, ArticleType, Classification } from '../models/hardcode';
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

    async upsertArticleStatus(id: string, title: string,
        dataSources: any) {

        const obj = ({
            id: id,
            title: title,

        });

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await ArticleStatus.findOneAndUpdate(
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
    async getArticleStatus(Id: string) {
        const data = await ArticleStatus.findById(Id);
        return data
    }


    async getArticlesStatuses() {
        const data = await ArticleStatus.find({});

        return data
    }
    async deleteArticleStatus(id: string) {
        try {
            const filter = { _id: new ObjectId(id) }
            const upsertedObj = await ArticleStatus.find(
                filter,

            ).remove()

            return id;
        }
        catch (err) {
            return null;
        }

    }



    async getArticleType(Id: string) {
        const data = await ArticleType.findById(Id);
        return data
    }
    async getArticlesTypes() {
        const data = await ArticleType.find({});

        return data
    }

    async upsertArticleType(id: string, title: string,
        dataSources: any) {

        const obj = ({
            id: id,
            title: title,

        });

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await ArticleType.findOneAndUpdate(
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

    async deleteArticleType(id: string) {
        try {
            const filter = { _id: new ObjectId(id) }
            const upsertedObj = await ArticleType.find(
                filter,

            ).remove()

            return id;
        }
        catch (err) {
            return null;
        }

    }
}
