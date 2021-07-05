import { gql, GraphQLUpload } from 'apollo-server'

const typeDefs = gql`
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
    role: String
    zone: String
    accessGroups: [String]
    classification: Int

  }


  type LoginResult {
    id: String!
    account_id: Int
    fullName: String
    username: String
    password: String
    isActive: Boolean
    createDate: String
    lastLoginDate: String
    role: String
    zone: String
    resourceAccesses: [ResourceAccess]
  }


  type InsGroup{
    id: String!
    code: Int!
    title: String!
    parentCode: Int!
  }

  type FileModel{
    fileName: String
    originalFileName: String
  }

  input FileModelInput{
    fileName: String
    originalFileName: String
  }

  type Comment{
    id: String,
    desc: String,
    creatorId: String,
    creatorName: String,
    persianCreateDate: String,
  }

  input CommentInput{
    desc: String,
    creatorId: String,
    persianCreateDate: String,
  }

  type Article {
    id: String!
    title: String
    description: String
    status: String
    createDate: String,
    persianCreateDate: String,
    creatorId: Int,
    tags: [String],
    insGroupCodes: [String]
    files: [FileModel]
    zones: [String]
    creatorName: String

    author: String,
    source: String,
    articleDate: String,
    classification: Int
    comments: [Comment]
  }

  type ActionResult {
    result: Boolean
    message: String
  }

  type ArticleStatus{
    id: String!
    title: String
  }

  type Classification{
    id: String!
    title: String
    rank: Int
  }

  type ArticleTag{
    id: String!
    title: String
  }

  type Zone{
    id: String!
    title: String
  }

  type UploadedFileResponse {
      filename: String
      mimetype: String
      encoding: String
      url: String
      originalFileName: String
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

  type AccessGroupResult{
    result: Boolean
    message: String
    totalCount: Int
    data: [AccessGroup]
  }

  type ResourceResult{
    result: Boolean
    message: String
    totalCount: Int
    data: [Resource]
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

  type Resource{
    id: String
    title: String
    engTitle: String
    path: String
  }

  type AccessGroup{
    id: String!
    title: String
    resourceAccesses: [ResourceAccess]
  }

  input ResoucesInput{
    title: String
    engTitle: String
  }

  type ResourceAccess{
    resource: Resource
    read: Boolean
    write: Boolean
    delete: Boolean
  }

  input ResourceInput{
    id: String
    title: String
    engTitle: String
  }

  input ResourcesAccessInput{
    resource: ResourceInput
    read: Boolean
    write: Boolean
    delete: Boolean
  }

  type Query {
    #accounts
    me: Account
    accounts(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): AccountResult
    getAccount(Id: ID): Account
    
    #articles
    getArticle(Id: String): Article
    articles(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String, zone: String, insGroupCode: Int): ArticleResult
    articleStatuses: [ArticleStatus]
    zones: [Zone]
    getZone(Id: String): Zone
    articleCountsByDate: [ArticleStat]
    getArticleStatus(Id: String): ArticleStatus
    advancedSearchArticle(pageNo: Int, pageSize: Int,title: String, description: String, source: String, author: String,
        articleStatus: String, selectedZone: String, articleFromDate: String, articleToDate: String, tags: [String]): ArticleResult

    #tags
    articleTags(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): ArticleTagResult
    getTag(Id: String): ArticleTag
    tagArticles(pageNo: Int, pageSize: Int, tagTitle: String): [Article]

    #insGroups
    getInsGroups: [InsGroup]

    # Access Groups and Resources
    getAccessGroup(Id: String): AccessGroup
    accessGroups(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): AccessGroupResult

    getResource(Id: String): Resource
    resources(pageNo: Int, pageSize: Int, filterText: String, sortType: String, sortkey: String): ResourceResult
  
    #Hardcodes
    classifications: [Classification]
    getClassification(Id: String): Classification

  }

  type Mutation {
    createAccount(email: String, password: String, mobile: String): Account!
    createTicket(title: String, description: String): Ticket!
    login(username: String, password: String): LoginResult
    upsertAccount(id: ID , username: String, fullName: String, password: String, 
    savedPassword: String, isActive: Boolean, role: String, zone: String, accessGroups: [String], classification: Int
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
      files: [FileModelInput], zones: [String], creatorName: String, author: String, source: String, 
      articleDate: String, classification: Int
      ): Article
    deleteArticle(id: String): String
    upsertArticleStatus(id: String , title: String): ArticleTag
    deleteArticleStatus(id: String): String
    addComment(articleId: String, desc: String): Comment
    deleteComment(articleId: String, commentId: String): String

    upsertZone(id: String , title: String): ArticleTag
    deleteZone(id: String): String

    createJob(company_id: String, data: Job): Boolean
    
    upsertTag(id: String , title: String): ArticleTag
    deleteTag(id: String): String

    singleUpload(id: String, entityType: String, file: FileUpload!): UploadedFileResponse

    saveInsGroups(data: [InsGroupInput]): Boolean

    upsertAccessGroup(id: String, title: String, resourceAccesses:[ResourcesAccessInput]): AccessGroup
    upsertResource(id: String, title: String, engTitle:String, path: String): Resource
    deleteAccessGroup(id: String): String

    #Hardcodes
    upsertClassification(id: String , title: String, rank:Int): ArticleTag
    deleteClassification(id: String): String

  }
`

module.exports = typeDefs