import { gql } from 'apollo-server'

const typeDefs = gql`
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
    insGroupCode: Int
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

  type Query {
    #accounts
    me: Account
    accounts(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): AccountResult
    getAccount(Id: ID): Account
    
    #articles
    getArticle(Id: String): Article
    articles(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): ArticleResult
    articleStatuses: [ArticleStatus]

    #tags
    articleTags(pageNo: Int, title: String): [ArticleTag]
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
    
    upsertCompany(
      id: String, title: String, about: String, atAGlance: String  
      about: String ,logo: String  ,lat: Float , lng: Float, size: String  ,website: String,
      members: [CompanyMemberInput],
      pictures: [CompanyPictureInput]
       ): Company


    upsertArticle(
      id: String , title: String, description: String, status: String, tags: [String], insGroupCode: Int
      ): Article
    deleteArticle(id: String): String

    createJob(company_id: String, data: Job): Boolean
    
    upsertTag(id: String , title: String): ArticleTag
    deleteTag(id: String): String
    
  }
`

module.exports = typeDefs