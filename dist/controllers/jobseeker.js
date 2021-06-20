"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobseekerController = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const Jobseeker = require('../models/jobseeker');
var ObjectId = require('mongoose').Types.ObjectId;
class JobseekerController extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
    }
    async getJobseekers(pageNo) {
        const data = await Jobseeker.find({});
        return data;
    }
    async upsertJobseeker(id, fullName, picFile, jobTitle, status, maritalStatus, birthYear, province, city, gender, address, militaryStatus, about, SeniorityLevel, minimumSalary, fieldOfWork, masteryLevel, benefits, skills, languages, dataSources) {
        const obj = {
            id: id,
            fullName: fullName,
            account_id: dataSources.req.userId,
            picFile: picFile,
            jobTitle: jobTitle,
            status: status,
            maritalStatus: maritalStatus,
            birthYear: birthYear,
            province: province,
            city: city,
            gender: gender,
            address: address,
            militaryStatus: militaryStatus,
            about: about,
            SeniorityLevel: SeniorityLevel,
            minimumSalary: minimumSalary,
            fieldOfWork: fieldOfWork,
            masteryLevel: masteryLevel,
            benefits: benefits,
            skills: skills,
            languages: languages
        };
        const filter = { _id: new ObjectId(id) };
        const upsertedObj = await Jobseeker.findOneAndUpdate(filter, obj, {
            new: true,
            upsert: true,
            projection: {}, // without return _id and __v
        });
        return upsertedObj;
    }
}
exports.JobseekerController = JobseekerController;
