"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const getCurrentPersianDate = () => {
    var moment = require('jalali-moment');
    return moment().locale('fa').format('YYYY/MM/DD');
};
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const Article = require('../models/article');
const ArticleStatus = require('../models/articleStatus');
const ArticleTag = require('../models/articleTags');
var ObjectId = require('mongoose').Types.ObjectId;
class ArticleController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getArticle(Id) {
        const data = await Article.findById(Id);
        //console.log(data);
        console.log(data);
        return data;
    }
    async getArticleStatus(Id) {
        const data = await ArticleStatus.findById(Id);
        return data;
    }
    async getTagArticles(pageNo, pageSize, tagTitle) {
        const data = await Article.find({ tags: tagTitle });
        return data;
    }
    async getTag(Id) {
        const data = await ArticleTag.findById(Id);
        return data;
    }
    async getArticles(pageNo, pageSize, filterText, sortType, sortkey) {
        const data = await Article.find({
            $or: [
                { title: { $regex: '.*' + filterText + '.*' } },
                { description: { $regex: '.*' + filterText + '.*' } },
            ]
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        const totalCount = await Article.find().count();
        //console.log(data)
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async getArticlesStatuses() {
        const data = await ArticleStatus.find({});
        return data;
    }
    async getArticlesTags(pageNo, pageSize, filterText, sortType, sortkey) {
        const data = await ArticleTag.find({
            title: { $regex: '.*' + filterText + '.*' }
        })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        const totalCount = await Article.find().count();
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async deleteArticle(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await Article.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
    async createArticle(title, description) {
        const article = new Article({ title: title, description: description });
        await article.save();
        return article;
    }
    async upsertArticle(id, title, description, status, tags, insGroupCodes, files, dataSources) {
        const createDate = new Date().toString();
        const strPersianCreateDate = getCurrentPersianDate();
        const obj = ({
            id: id,
            title: title,
            description: description,
            status: status,
            createDate: createDate,
            persianCreateDate: strPersianCreateDate,
            creatorId: dataSources.req.account_id,
            insGroupCodes: insGroupCodes,
            tags: tags,
            files: files
        });
        console.log('account id=', dataSources.req.account_id);
        if (id !== null) {
            console.log('is update');
            //delete obj.createDate
            delete obj.creatorId;
            //delete obj.persianCreateDate
        }
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await Article.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        //console.log(tags);
        // Check each tag to make sure it is present in articleTags and insert if not
        for (let i = 0; i < tags.length; i++) {
            const curTag = tags[i];
            const curTagExist = await ArticleTag.find({ title: curTag });
            if (curTagExist.length === 0) { //not found
                const newTag = new ArticleTag({
                    title: tags[i],
                });
                await newTag.save();
                console.log('new tag saved' + curTag);
            }
        }
        console.log('saved');
        console.log(upsertedObj);
        return upsertedObj;
    }
    async upsertTag(id, title, dataSources) {
        const obj = ({
            id: id,
            title: title,
        });
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await ArticleTag.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async deleteTag(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await ArticleTag.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
    async uploadFile(id, entityType, file) {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const path = require("path");
        const { createWriteStream } = require("fs");
        // Do work 💪
        console.log(path.join("", "../uploads/", filename));
        const fileExtension = filename.split('.').pop();
        const newFileFullName = uuid() + '.' + fileExtension;
        await new Promise((res) => createReadStream()
            .pipe(createWriteStream(
        //path.join(__dirname, "../../../website/uploads/", filename)
        path.join(__dirname, "../../uploads/", newFileFullName)))
            .on("close", res)).then(async () => {
            switch (entityType) {
                case 'Article':
                    const data = await Article.findById(id);
                    var files = data.files;
                    if (files === undefined)
                        files = [newFileFullName];
                    else
                        files.push(newFileFullName);
                    data.files = files;
                    await data.save();
                    break;
                default:
                    break;
            }
        });
        return { filename: newFileFullName, mimetype, encoding, url: '' };
    }
    async articleCountsByDate() {
        try {
            const data = await Article.aggregate([
                {
                    $group: {
                        _id: "$persianCreateDate",
                        articleCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: 15
                },
            ]);
            // var pipeline = [
            //   {
            //       "$group": {
            //           "_id": "$keyword",
            //           "total": { "$sum": 1 },
            //           "llcId": { "$first": "$llcId"},
            //           "categoryId": { "$first": "$categoryId"},
            //           "parentId": { "$first": "$parentId"}
            //       }
            //   }
            //];
            //db.keyword.aggregate(pipeline)
            console.log(data);
            return data;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async upsertArticleStatus(id, title, dataSources) {
        const obj = ({
            id: id,
            title: title,
        });
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await ArticleStatus.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async deleteArticleStatus(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await ArticleStatus.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
}
exports.ArticleController = ArticleController;
