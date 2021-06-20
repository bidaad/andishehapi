import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
const company = require('../models/company');


var ObjectId = require('mongoose').Types.ObjectId;

interface CompanyMemberInput {
    fullName: String,
    position: String,
    about: String,
}
interface CompanyPictureInput {
    picFile: String,
    description: String,
}

interface Picture {
    picFile: String
    description: String
}

interface CompanyMember {
    fullName: String
    position: String
    about: String
}

interface Benefit {
    possibilityOfPromotion: Boolean
    insurance: Boolean
    educationCourses: Boolean
    flexibleHours: Boolean
    commutingService: Boolean
    meal: Boolean
}

interface JobInput {
    job_id: String,
    title: String,
    status: String,
    category: String,
    province: String,
    city: String,
    contractType: String,
    minimumWorkExperience: String,
    salary: String,
    description: String,
    gender: String,
    militaryStatus: String,
    minimumDegree: String,
    expDate: String,
    skills: [String],
    benefits: Benefit

}



export class CompanyController extends RESTDataSource {
    constructor() {
        super()
    }

    async getCompanys(pageNo: number) {
        const data = await company.find({});
        
        return data
    }

    async upsertCompany(id: string, title: string, about: string, atAGlance: string, logo: string, lat: Number, lng: Number, size: string, website: string,
        members: CompanyMember[],
        pictures: Picture[],
        dataSources: any) {
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


        const filter = { _id: new ObjectId(id) }
        const upsertedObj = await company.findOneAndUpdate(
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

    async updateCompany(id: string, title: string, about: string, atAGlance: string, logo: string, lat: Number, lng: Number, size: string, website: string, dataSources: any) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });

        mongodbObj.title = title
        mongodbObj.about = about
        mongodbObj.atAGlance = atAGlance
        mongodbObj.logo = logo
        mongodbObj.lat = lat
        mongodbObj.lng = lng
        mongodbObj.size = size
        mongodbObj.website = website

        await mongodbObj.save();
        return mongodbObj;
    }

    async updateCompanyMembers(id: string, members: CompanyMemberInput, dataSources: any) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });
        mongodbObj.members = members

        await mongodbObj.save();
        return true;
    }
    async updateCompanyPictures(id: string, pictures: CompanyPictureInput, dataSources: any) {
        const mongodbObj = await company.findOne({ _id: new ObjectId(id) });
        mongodbObj.pictures = pictures

        await mongodbObj.save();
        return true;
    }

    async createJob(company_id: string, data: JobInput, dataSources: any) {
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
        }
        mongodbObj.jobs.push(newJob)
        await mongodbObj.save();
        return true;
    }

}
