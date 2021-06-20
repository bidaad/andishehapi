import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { idText } from 'typescript';
const Jobseeker = require('../models/jobseeker');
var ObjectId = require('mongoose').Types.ObjectId;


interface Benefit {
    possibilityOfPromotion: Boolean
    insurance: Boolean
    educationCourses: Boolean
    flexibleHours: Boolean
    commutingService: Boolean
    meal: Boolean
}

interface Language {
    title: String
    masteryLevel: String
}


export class JobseekerController extends RESTDataSource {
    constructor() {
        super()
    }

    async getJobseekers(pageNo: number) {
        const data = await Jobseeker.find({});
        
        return data
    }

    async upsertJobseeker(
        id: string,
        fullName: string,
        picFile: string,
        jobTitle: string,
        status: string,
        maritalStatus: string,
        birthYear: Number,
        province: string,
        city: string,
        gender: string,
        address: string,
        militaryStatus: string,
        about: string,
        SeniorityLevel: string,
        minimumSalary: string,
        fieldOfWork: string,
        masteryLevel: string,
        benefits: Benefit,
        skills: string[],
        languages: Language[],
        dataSources: any
    ) {

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
        }

        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await Jobseeker.findOneAndUpdate(
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

}
