"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const company = require('../models/company');
var ObjectId = require('mongoose').Types.ObjectId;
class CompanyController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getCompanys(pageNo) {
        const data = await company.find({});
        return data;
    }
    async upsertCompany(id, title, about, atAGlance, logo, lat, lng, size, website, members, pictures, dataSources) {
        const obj = ({
            id: id,
            title: title,
            about: about,
            account_id: dataSources.req.userId,
            atAGlance: atAGlance,
            logo: logo,
            lat: lat,
            lng: lng,
            size: size,
            website: website,
            members: members,
            pictures: pictures,
        });
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await company.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
    async updateCompany(id, title, about, atAGlance, logo, lat, lng, size, website, dataSources) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });
        mongodbObj.title = title;
        mongodbObj.about = about;
        mongodbObj.atAGlance = atAGlance;
        mongodbObj.logo = logo;
        mongodbObj.lat = lat;
        mongodbObj.lng = lng;
        mongodbObj.size = size;
        mongodbObj.website = website;
        await mongodbObj.save();
        return mongodbObj;
    }
    async updateCompanyMembers(id, members, dataSources) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });
        mongodbObj.members = members;
        await mongodbObj.save();
        return true;
    }
    async updateCompanyPictures(id, pictures, dataSources) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });
        mongodbObj.pictures = pictures;
        await mongodbObj.save();
        return true;
    }
    async createJob(company_id, data, dataSources) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(company_id) });
        const jobId = Math.floor(Math.random() * 1000000000);
        const newJob = {
            job_id: jobId,
            title: data.title,
            status: data.status,
            category: data.category,
            province: data.province,
            city: data.city,
            contractType: data.contractType,
            minimumWorkExperience: data.minimumWorkExperience,
            salary: data.salary,
            description: data.description,
            skills: data.skills,
            gender: data.gender,
            militaryStatus: data.militaryStatus,
            minimumDegree: data.minimumDegree,
            expDate: data.expDate
        };
        mongodbObj.jobs.push(newJob);
        await mongodbObj.save();
        return true;
    }
}
exports.CompanyController = CompanyController;
