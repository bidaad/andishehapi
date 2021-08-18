import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { sign } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from "../config";
import { correctPersian } from '../helper/utils';

export interface Article {
  _id?: string,
  id?: string,
  title: string,
  description: string,
  tags: string[],
  status: string,
  createDate?: Date,
  files: String[],
  insGroupCodes: Number[],
  creatorId?: number,
  persianCreateDate?: string,
  zones: String[]
  creatorName?: string
  source?: string
  author: string
  articleDate: string
  classification: string
  comments?: Comment[]
  articleType: string
  changeLogs: ArticleLog[]
}
interface ArticleLog{
  userFullName: string
  userId: string
  changeDate: Date
}

interface Comment {
  id: string;
  desc: string,
  creatorId: string,
  persianCreateDate: string,
  creatorName: string,

}


const getCurrentPersianDate = () => {
  var moment = require('jalali-moment');
  return moment().locale('fa').format('YYYY/MM/DD');

}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const Article = require('../models/article');
const ArticleTag = require('../models/articleTags');
const Zone = require('../models/zone');
const Account = require('../models/account');

var ObjectId = require('mongoose').Types.ObjectId;


export class ArticleController extends RESTDataSource {
  constructor() {
    super()
  }

  async getArticle(Id: string) {
    const data = await Article.findById(Id);
    //console.log(data);

    return data
  }


  async getZones() {
    const data = await Zone.find({});

    return data
  }
  async getTagArticles(pageNo: Number, pageSize: Number, tagTitle: string) {
    const data = await Article.find({ tags: tagTitle });

    return data
  }



  async getTag(Id: string) {
    const data = await ArticleTag.findById(Id);
    return data
  }

  async getArticles(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String, insGroupCode: number,
    dataSources: any) {

    var data;
    var totalCount;

    const account_id = dataSources.req.account_id;
    const classification = dataSources.req.classification;
    //console.log(insGroupCode);

    //console.log('account_id=' + dataSources.req.account_id);
    //    console.log(dataSources.req.classification);

    var query: any = { $or: [], $and: [{}] };;
    query.$or.push({
      creatorId: { $eq: account_id }
    });
    query.$or.push({
      classification: { $lte: classification }
    });


    if (insGroupCode != 0)
      query.$and.push({
        insGroupCodes: { $in: insGroupCode }
      });


    data = await Article.find(query)
      .sort({ 'createDate': -1 })
      .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
      .limit(pageSize)
      ;
    totalCount = await Article.find(query).count();

    return { result: true, message: '', totalCount: totalCount, data: data }
  }


  async advancedSearchArticle(pageNo: number, pageSize: number, title: string, description: string,
    source: string, author: string,
    articleStatus: string, selectedZone: string, articleFromDate: string, articleToDate: string, 
    tags: string[], selectedArticleType: string) {

    var data;
    var totalCount;

    console.log('articleFromDate');
    
    console.log(articleFromDate);
    
    var query: any = { $and: [{ title: { $regex: '.*' + '' + '.*' } }] };
    if (title !== '') {
      const titleArray = title.split(' ')
      for (let i = 0; i < titleArray.length; i++) {
        const element = titleArray[i];
        //console.log('1' + element);
        query.$and.push({
          title: { $regex: '.*' + element + '.*' }
        });
      }
      // query.$and.push({
      //   title: { $regex: '.*' + title + '.*' }
      // });
    }
    if (description !== '') {
      const descriptionArray = description.split(' ')
      for (let i = 0; i < descriptionArray.length; i++) {
        const element = descriptionArray[i];
      //  console.log(element);

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

    if (tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const curTag = tags[i];
        query.$and.push({
          tags: { $in: curTag }
        });
      }

    }

  //console.log('selectedArticleType=', selectedArticleType);
  
    if (selectedArticleType !== '')
      query.$and.push({
        articleType: selectedArticleType
      });

    data = await Article.find(query)
      .sort({ persianCreateDate: -1 })
      .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
      .limit(pageSize)
      ;

    totalCount = await Article.find(query).count();



    return { result: true, message: '', totalCount: totalCount, data: data }
  }


  async getArticlesTags(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String) {
    const data = await ArticleTag.find({
      title: { $regex: '.*' + filterText + '.*' }
    })
      .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
      .limit(pageSize)
      ;

    const totalCount = await Article.find().count();

    return { result: true, message: '', totalCount: totalCount, data: data }
  }


  async deleteArticle(id: string) {
    try {
      const filter = { _id: new ObjectId(id) }
      const upsertedObj = await Article.find(
        filter,

      ).remove()

      return id;
    }
    catch (err) {
      return null;
    }

  }

  async createArticle(title: string, description: string) {
    const article = new Article({ title: title, description: description });
    await article.save();
    return article;
  }

  async upsertArticle(id: string, title: string, description: string, status: string, tags: string[],
    insGroupCodes: Number[], files: String[], zones: String[], creatorName: string,
    author: string, source: string, articleDate: string, classification: string, articleType:string,
    dataSources: any) {


   // console.log(dataSources.req.account_id);

    const createDate = new Date();//.toString();
    const strPersianCreateDate = getCurrentPersianDate();
    const obj: Article = {
      id: id,
      title: correctPersian(title),
      description: correctPersian(description),
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
      articleType: articleType,
      changeLogs: []
    };

    if (id !== null) {

      delete obj.createDate
      delete obj.creatorId
      delete obj.persianCreateDate
      delete obj.creatorName
    }

    const filter = { _id: new ObjectId(id) }

    const curArticle = await Article.findOne(filter)
    if(curArticle !== null)
    {
      var curChangeLog = curArticle.changeLogs;
      const curUser = await Account.findOne({account_id: dataSources.req.account_id})
      const newChangeLog = {
        userFullName: curUser.fullName,
        userId: dataSources.req.account_id,
        changeDate: new Date()
      }
      const finalChangeLog = curChangeLog.concat(newChangeLog);
      obj.changeLogs = finalChangeLog
    }

    const upsertedObj = await Article.findOneAndUpdate(
      filter,
      obj,
      {
        new: true, // Always returning updated work experiences.
        upsert: true, // By setting this true, it will create if it doesn't exist
        projection: {}, // without return _id and __v
      }
    )
    //console.log(tags);

    // Check each tag to make sure it is present in articleTags and insert if not
    for (let i = 0; i < tags.length; i++) {
      const curTag = tags[i];

      const curTagExist = await ArticleTag.find({ title: curTag });

      if (curTagExist.length === 0) {//not found
        const newTag = new ArticleTag({
          title: tags[i],
        });
        await newTag.save();

      }
    }



    return upsertedObj;
  }


  async addComment(articleId: string, desc: string,
    dataSources: any) {
    const strPersianCreateDate = getCurrentPersianDate();
    const data = await Article.findById(articleId);
    //console.log('id=' + dataSources.req);

    const user = await Account.findOne({ account_id: dataSources.req.account_id });
    const newComment: Comment = {
      id: Math.random().toString(),
      desc: desc,
      creatorId: dataSources.req.account_id,
      persianCreateDate: strPersianCreateDate,
      creatorName: user.fullName
    }
    var currentComments = data.comments;
    currentComments.push(newComment)

    data.comments = currentComments;
    await data.save();

    return newComment;
  }

  async deleteComment(articleId: string, commentId: string,
    dataSources: any) {

    try {
      const data = await Article.findById(articleId);
      var comments = data.comments;
      data.comments = comments.filter((item: any) => item.id !== commentId)

      const filter = { _id: new ObjectId(articleId) }
      const upsertedObj = await Article.findOneAndUpdate(
        filter,
        data,
        {
          new: true, // Always returning updated work experiences.
          upsert: false, // By setting this true, it will create if it doesn't exist
          projection: {}, // without return _id and __v
        }
      )

      return commentId;
    }
    catch {
      return null;
    }
  }



  async upsertTag(id: string, title: string,
    dataSources: any) {

    const obj = ({
      id: id,
      title: title,

    });

    const filter = { _id: new ObjectId(id) }
    const upsertedObj = await ArticleTag.findOneAndUpdate(
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


  async deleteTag(id: string) {
    try {
      const filter = { _id: new ObjectId(id) }
      const upsertedObj = await ArticleTag.find(
        filter,

      ).remove()

      return id;
    }
    catch (err) {
      return null;
    }

  }


  async uploadFile(id: string, entityType: string, file: any) {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const path = require("path");
    const { createWriteStream } = require("fs");
    // Do work 💪


    const fileExtension = filename.split('.').pop();
    const newFileFullName = uuid() + '.' + fileExtension;
    await new Promise((res) =>

      createReadStream()
        .pipe(
          createWriteStream(
            //path.join(__dirname, "../../../website/uploads/", filename)
            path.join(__dirname, "../../uploads/", newFileFullName)
          )
        )
        .on("close", res)

    ).then(async () => {
      switch (entityType) {
        case 'Article':

          const data = await Article.findById(id);
          var files = data.files;
          if (files === undefined)
            files = [{ fileName: newFileFullName, originalFileName: filename }]
          else
            files.push({ fileName: newFileFullName, originalFileName: filename });
          data.files = files;
          await data.save();

          break;

        default:
          break;
      }
    }
    )

    return { filename: newFileFullName, mimetype, encoding, url: '', originalFileName: filename }

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
          $sort:
            { _id: -1 }
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




  async upsertZone(id: string, title: string,
    dataSources: any) {

    const obj = ({
      id: id,
      title: title,
    });

    const filter = { _id: new ObjectId(id) }
    const upsertedObj = await Zone.findOneAndUpdate(
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


  async deleteZone(id: string) {
    try {
      const filter = { _id: new ObjectId(id) }
      const upsertedObj = await Zone.find(
        filter,
      ).remove()

      return id;
    }
    catch (err) {
      return null;
    }

  }

  async getZone(Id: string) {
    const data = await Zone.findById(Id);
    return data
  }


  async getUserArticleCounts(fromDate: string, toDate: string, userIDs: number[]) {
    try {
      var data;
      var totalCount;

      var query: any = { $and: [ {creatorId: { $gte: 0 }}] };
      
      if (fromDate !== '') {
        query.$and.push({
          createDate: { $gte: new Date(fromDate) }
        });
      }
      if (toDate !== '') {
        query.$and.push({
          createDate: { $lte: new Date(toDate) }
        });
      }

      
      if (userIDs.length > 0) {
        query.$and.push({
          creatorId: { $in: userIDs }
        });
      }
  
      //console.log(query);

      // data = await UserLog.aggregate(query)
      //   .sort({ logDate: -1 })
      //   ;
      data = await Article.aggregate([
        {$match: query},
        {$group:{_id:"$creatorId",ArticleCount:{$sum:1}}},
        {$lookup:{from: "accounts",localField: "_id",foreignField: "account_id",as: "curUser"} },
        {$project: {
          "_id": 1,
          "creatorId": 1,
          "createDate": 1,
          "ArticleCount": 1,
          "curUser._id": 1,
          "curUser.fullName": 1
        }}
      ]

      )

     // console.log(query);

      totalCount = await Article.find(query).countDocuments();
      return { result: true, message: '', totalCount: totalCount, data: data }

    }
    catch (err) {
      console.log(err);
      
      return { result: false, message: 'بروز خطا' }
    }

  }

}





