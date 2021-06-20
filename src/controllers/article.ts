import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { sign } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from "../config";

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
const ArticleStatus = require('../models/articleStatus');
const ArticleTag = require('../models/articleTags');

var ObjectId = require('mongoose').Types.ObjectId;


export class ArticleController extends RESTDataSource {
  constructor() {
    super()
  }

  async getArticle(Id: string) {
    const data = await Article.findById(Id);
    //console.log(data);
    console.log(data);

    return data
  }

  async getArticleStatus(Id: string) {
    const data = await ArticleStatus.findById(Id);
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

  async getArticles(pageNo: number, pageSize: number, filterText: String, sortType: String, sortkey: String) {
    const data = await Article.find({
      $or: [
        { title: { $regex: '.*' + filterText + '.*' } },
        { description: { $regex: '.*' + filterText + '.*' } },
      ]
    })
      .skip(pageNo > 0 ? ((pageNo - 1) * pageSize) : 0)
      .limit(pageSize)
      ;

    const totalCount = await Article.find().count();


    //console.log(data)
    return { result: true, message: '', totalCount: totalCount, data: data }
  }

  async getArticlesStatuses() {
    const data = await ArticleStatus.find({} );

    return data
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

  async upsertArticle(id: string, title: string, description: string, status: string, tags: string[], insGroupCodes: Number[], files: String[],
    dataSources: any) {
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
      delete obj.creatorId
      //delete obj.persianCreateDate
    }

    const filter = { _id: new ObjectId(id) }
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
        console.log('new tag saved' + curTag);

      }
    }


    console.log('saved');
    console.log(upsertedObj);

    return upsertedObj;
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

    console.log(path.join("", "../uploads/", filename));

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
            files = [newFileFullName]
          else
            files.push(newFileFullName);
          data.files = files;
          await data.save();

          break;

        default:
          break;
      }
    }
    )

    return { filename: newFileFullName, mimetype, encoding, url: '' }

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

      console.log(data);


      return data;
    }
    catch (err) {
      console.log(err);

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


}



