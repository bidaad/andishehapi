"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const JobSeeker = mongoose.model("JobSeeker", {
    fullName: String,
    account_id: Number,
    picFile: String,
    jobTitle: String,
    status: String,
    maritalStatus: String,
    birthYear: Number,
    province: String,
    city: String,
    gender: String,
    address: String,
    militaryStatus: String,
    about: String,
    SeniorityLevel: String,
    minimumSalary: String,
    skills: [String],
    educationalBackground: [Object],
    languages: [Object],
    jobProvinces: [String],
    fieldOfWork: String,
    masteryLevel: String,
    contractTypes: [String],
    benefits: Object,
    workExperiences: [Object]
});
module.exports = JobSeeker;
