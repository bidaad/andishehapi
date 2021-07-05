"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const utils_1 = require("../helper/utils");
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
const Zone = require('../models/zone');
const Account = require('../models/account');
var ObjectId = require('mongoose').Types.ObjectId;
class ArticleController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getArticle(Id) {
        const data = await Article.findById(Id);
        console.log(data);
        return data;
    }
    async getArticleStatus(Id) {
        const data = await ArticleStatus.findById(Id);
        return data;
    }
    async getZones() {
        const data = await Zone.find({});
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
    async getArticles(pageNo, pageSize, filterText, sortType, sortkey, zone) {
        var data;
        var totalCount;
        console.log('zone=' + zone);
        if (zone !== null && zone !== '') {
            data = await Article.find({
                $or: [
                    { title: { $regex: '.*' + filterText + '.*' } },
                    { description: { $regex: '.*' + filterText + '.*' } },
                ],
                zones: { $in: zone }
            })
                .sort({ persianCreateDate: 1 })
                .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
                .limit(pageSize);
            totalCount = await Article.find({
                $or: [
                    { title: { $regex: '.*' + filterText + '.*' } },
                    { description: { $regex: '.*' + filterText + '.*' } },
                ],
                zones: { $in: zone }
            }).count();
        }
        else {
            data = await Article.find({
                $or: [
                    { title: { $regex: '.*' + filterText + '.*' } },
                    { description: { $regex: '.*' + filterText + '.*' } },
                ]
            })
                .sort({ persianCreateDate: -1 })
                .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
                .limit(pageSize);
            totalCount = await Article.find({
                $or: [
                    { title: { $regex: '.*' + filterText + '.*' } },
                    { description: { $regex: '.*' + filterText + '.*' } },
                ],
            }).count();
        }
        return { result: true, message: '', totalCount: totalCount, data: data };
    }
    async advancedSearchArticle(pageNo, pageSize, title, description, source, author, articleStatus, selectedZone, articleFromDate, articleToDate) {
        var data;
        var totalCount;
        var query = { $and: [{ title: { $regex: '.*' + '' + '.*' } }] };
        if (title !== '') {
            const titleArray = title.split(' ');
            for (let i = 0; i < titleArray.length; i++) {
                const element = titleArray[i];
                console.log('1' + element);
                query.$and.push({
                    title: { $regex: '.*' + element + '.*' }
                });
            }
            // query.$and.push({
            //   title: { $regex: '.*' + title + '.*' }
            // });
        }
        if (description !== '') {
            const descriptionArray = description.split(' ');
            for (let i = 0; i < descriptionArray.length; i++) {
                const element = descriptionArray[i];
                console.log(element);
                query.$and.push({
                    description: { $regex: '.*' + element + '.*' }
                });
            }
        }
        if (source !== '')
            query.$and.push({
                source: { $regex: '.*' + source + '.*' }
            });
        if (author !== '')
            query.$and.push({
                author: { $regex: '.*' + author + '.*' }
            });
        if (articleStatus !== '')
            query.$and.push({
                status: articleStatus
            });
        if (selectedZone !== '') {
            query.$and.push({
                zones: { $in: selectedZone }
            });
        }
        if (articleFromDate !== '') {
            query.$and.push({
                articleDate: { $gte: articleFromDate }
            });
        }
        if (articleToDate !== '') {
            query.$and.push({
                articleDate: { $lte: articleToDate }
            });
        }
        data = await Article.find(query)
            .sort({ persianCreateDate: -1 })
            .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
            .limit(pageSize);
        totalCount = await Article.find(query).count();
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
    async upsertArticle(id, title, description, status, tags, insGroupCodes, files, zones, creatorName, author, source, articleDate, classification, dataSources) {
        console.log(dataSources.req.account_id);
        const createDate = new Date().toString();
        const strPersianCreateDate = getCurrentPersianDate();
        const obj = {
            id: id,
            title: utils_1.correctPersian(title),
            description: utils_1.correctPersian(description),
            status: status,
            createDate: createDate,
            persianCreateDate: strPersianCreateDate,
            creatorId: dataSources.req.account_id,
            insGroupCodes: insGroupCodes,
            tags: tags,
            files: files,
            zones: zones,
            creatorName: creatorName,
            classification: classification,
            author: author,
            source: source,
            articleDate: articleDate,
        };
        if (id !== null) {
            delete obj.createDate;
            delete obj.creatorId;
            delete obj.persianCreateDate;
            delete obj.creatorName;
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
            }
        }
        return upsertedObj;
    }
    async addComment(articleId, desc, dataSources) {
        const strPersianCreateDate = getCurrentPersianDate();
        const data = await Article.findById(articleId);
        //console.log('id=' + dataSources.req);
        const user = await Account.findOne({ account_id: dataSources.req.account_id });
        const newComment = {
            id: Math.random().toString(),
            desc: desc,
            creatorId: dataSources.req.account_id,
            persianCreateDate: strPersianCreateDate,
            creatorName: user.fullName
        };
        var currentComments = data.comments;
        currentComments.push(newComment);
        data.comments = currentComments;
        await data.save();
        return newComment;
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
                        files = [{ fileName: newFileFullName, originalFileName: filename }];
                    else
                        files.push({ fileName: newFileFullName, originalFileName: filename });
                    data.files = files;
                    await data.save();
                    break;
                default:
                    break;
            }
        });
        return { filename: newFileFullName, mimetype, encoding, url: '', originalFileName: filename };
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
            return data;
        }
        catch (err) {
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
    async upsertZone(id, title, dataSources) {
        const obj = ({
            id: id,
            title: title,
        });
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await Zone.findOneAndUpdate(filter, obj, {
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
    async deleteZone(id) {
        try {
            const filter = { _id: new ObjectId(id) };
            const upsertedObj = await Zone.find(filter).remove();
            return id;
        }
        catch (err) {
            return null;
        }
    }
    async getZone(Id) {
        const data = await Zone.findById(Id);
        return data;
    }
}
exports.ArticleController = ArticleController;
