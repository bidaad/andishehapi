"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = apollo_server_1.gql `
  scalar FileUpload
  type Account {
    id: String!
    account_id: Int
    fullName: String
    username: String
    password: String
    isActive: Boolean
    createDate: String
    lastLoginDate: String
  }

  type InsGroup{
    id: String!
    code: Int!
    title: String!
    parentCode: Int!
  }

  type Article {
    id: String!
    title: String
    description: String
    status: String
    createDate: String,
    creatorId: Int,
    tags: [String],
    insGroupCodes: [String]
    files: [String]
  }

  type ActionResult {
    result: Boolean
    message: String
  }

  type ArticleStatus{
    id: String!
    title: String
  }
  type ArticleTag{
    id: String!
    title: String
  }

  type UploadedFileResponse {
      filename: String
      mimetype: String
      encoding: String
      url: String
    }

  type Company{
    id: String!
    title: String  
    account_id: Int
    atAGlance: String  
    about: String  
    logo: String  
    lat: Float 
    lng: Float
    size: String  
    website: String 
    
  }

  input Job {
    title: String!
    status: String! 
    category: String! 
    province: String! 
    city: String! 
    contractType: String 
    minimumWorkExperience: String 
    salary: String 
    description: String 
    gender: String 
    militaryStatus: String 
    minimumDegree: String 
    expDate: String
    skills: [String]
    benefits: BenefitInput
  }

  type Picture{
    picFile: String
    description: String
  }

  type CompanyMember{
    fullName: String
    position: String
    about: String
  }

  type Ticket {
    id: String!
    title: String
    description: String
    date: String
    status: String
  }

  type JobSeeker{
    id: String!
    fullName: String  
    account_id: Int 
    picFile: String  
    jobTitle: String  
    status: String 
    maritalStatus: String  
    birthYear: Int 
    province: String 
    city: String 
    gender: String 
    address: String 
    militaryStatus: String 
    about: String 
    SeniorityLevel: String 
    minimumSalary: String  
    skills: [String] 
    educationals: [Education]
    languages: [Language]
    jobProvinces: [String]
    fieldOfWork: String  
    masteryLevel: String  
    contractTypes: [String]
    # benefits: BenefitInput
    workExperiences: [Experience]


  }

  type Education{
    major: String 
    university: String 
    grade: String 
    startYear: Int 
    endYear: Int 
    stillStudy: Boolean 
    description: String
  }

  input BenefitInput{
    possibilityOfPromotion: Boolean 
    insurance: Boolean 
    educationCourses: Boolean 
    flexibleHours: Boolean 
    commutingService: Boolean 
    meal: Boolean
  }
  type Benefit{
    possibilityOfPromotion: Boolean 
    insurance: Boolean 
    educationCourses: Boolean 
    flexibleHours: Boolean 
    commutingService: Boolean 
    meal: Boolean
  }

  type Experience  {
    title: String  
    company: String  
    fromMonth: Int 
    fromYear: Int 
    toMonth: Int 
    toYear: Int 
    stillWorking: Boolean 
    description: String 
    
  }
  type Language{
    title: String
    masterLevel: String
  }


  type ArticleResult{
    result: Boolean
    message: String
    totalCount: Int
    data: [Article]
  }

  type AccountResult{
    result: Boolean
    message: String
    totalCount: Int
    data: [Account]
  }

  type ArticleTagResult{
    result: Boolean
    message: String
    totalCount: Int
    data: [ArticleTag]
  }

  input LanguageInput{
    title: String
    masterLevel: String
  }


  input CompanyMemberInput{
    fullName: String
    position: String
    about: String
  }
  input CompanyPictureInput{
    picFile: String
    description: String
  }

  input InsGroupInput{
    code: Int!
    title: String!
    parentCode: Int!
  }

  type ArticleStat{
    _id: String
    articleCount: Int
  }



  type Query {
    #accounts
    me: Account
    accounts(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): AccountResult
    getAccount(Id: ID): Account
    
    #articles
    getArticle(Id: String): Article
    articles(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): ArticleResult
    articleStatuses: [ArticleStatus]
    articleCountsByDate: [ArticleStat]
    getArticleStatus(Id: String): ArticleStatus

    #tags
    articleTags(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): ArticleTagResult
    getTag(Id: String): ArticleTag
    tagArticles(pageNo: Int, pageSize: Int, tagTitle: String): [Article]

    #insGroups
    getInsGroups: [InsGroup]
  }

  type Mutation {
    createAccount(email: String, password: String, mobile: String): Account!
    createTicket(title: String, description: String): Ticket!
    login(username: String, password: String): Account
    upsertAccount(
      id: ID , username: String, fullName: String, password: String, savedPassword: String, isActive: Boolean, 
       ): Account
    logout:Boolean
    changePassword(account_id: Int, oldPassword: String, newPassword: String): ActionResult
    deleteAccount(id: String): String
    
    upsertCompany(
      id: String, title: String, about: String, atAGlance: String  
      about: String ,logo: String  ,lat: Float , lng: Float, size: String  ,website: String,
      members: [CompanyMemberInput],
      pictures: [CompanyPictureInput]
       ): Company


    upsertArticle(
      id: String , title: String, description: String, status: String, tags: [String], insGroupCodes: [String],
      files: [String]
      ): Article
    deleteArticle(id: String): String
    upsertArticleStatus(id: String , title: String): ArticleTag
    deleteArticleStatus(id: String): String


    createJob(company_id: String, data: Job): Boolean
    
    upsertTag(id: String , title: String): ArticleTag
    deleteTag(id: String): String

    singleUpload(id: String, entityType: String, file: FileUpload!): UploadedFileResponse

    saveInsGroups(data: [InsGroupInput]): Boolean
    
  }
`;
module.exports = typeDefs;
