import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
const InsGroup = require('../models/insGroup');
var ObjectId = require('mongoose').Types.ObjectId;


export class InsGroupController extends RESTDataSource {
  constructor() {
    super()
  }

  async getInsGroups() {
    const data = await InsGroup.find();
    //console.log('hhhhhhhh')
    return data
  }
  

}
