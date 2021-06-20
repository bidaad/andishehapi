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

  async save(insGroupsArray: any) {
    const data = await InsGroup.deleteMany();

    for (let i = 0; i < insGroupsArray.length; i++) {
      const element = insGroupsArray[i];
      const newInsGroup = new InsGroup(element);
      await newInsGroup.save();
        
    }
    return true
  }
  

}
