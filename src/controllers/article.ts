import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { sign } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from "../config";


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
    const data = await ArticleStatus.find({}, function (err, doc) {

    });

    return data
  }

  async getArticlesTags(pageNo: Number, title: string) {
    const data = await ArticleTag.find({ title: { $regex: '.*' + title + '.*' } }, function (err, doc) {

    });
    console.log('article tags');


    return data
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

  async upsertArticle(id: string, title: string, description: string, status: string, tags: string[], insGroupCode: Number,
    dataSources: any) {
    const createDate = new Date().toString();

    const obj = ({
      id: id,
      title: title,
      description: description,
      status: status,
      createDate: createDate,
      creatorId: dataSources.req.account_id,
      insGroupCode: insGroupCode,
      tags: tags,
    });
    console.log('account id=', dataSources.req.account_id);

    if (id !== null) {
      console.log('is update');

      delete obj.createDate
      delete obj.creatorId
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
}

