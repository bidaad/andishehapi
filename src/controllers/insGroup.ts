import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
const InsGroup = require('../models/insGroup');
var ObjectId = require('mongoose').Types.ObjectId;


export class InsGroupController extends RESTDataSource {
  constructor() {
    super()
  }

  async getInsGroups() {
    const data = await InsGroup.find();
    return data
  }

  async save(insGroupsArray: any) {
    const data = await InsGroup.deleteMany();

    for (let i = 0; i < insGroupsArray.length; i++) {

      try{
      const element = insGroupsArray[i];
      const newInsGroup = new InsGroup(element);
      await newInsGroup.save();
      }
      catch{
        
      }

    }
    return true
  }

  async updateInsGroupParent(code: number, newParentCode: number) {
    try {
      const curNode = await InsGroup.findOne({ code: code });
      //console.log(curNode);
      
      curNode.parentCode = newParentCode
      await curNode.save();
      return true
    }
    catch(ex) {
      console.log(ex);
      
      return false;
    }
  }


}
