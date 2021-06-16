import { IResolvers, GraphQLUpload } from 'apollo-server'

const resolvers: IResolvers = {
  FileUpload: GraphQLUpload,
  Query: {
    me: async (_, res, dataSources) => {
      console.log(dataSources.req);
      console.log('me iiiddd=' + dataSources.req.account_id);


      if (!dataSources.req.account_id)
        return null;

      return dataSources.accountController.getCurrentAccount(dataSources.req.account_id)
    },
    accounts: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
      const data = dataSources.accountController.getAccounts(pageNo, pageSize, filterText, sortType, sortkey)
      return data
    },
    getAccount: async (_, { Id }, dataSources) => {

      const data = dataSources.accountController.getAccountById(Id)
      return data
    },


    //articles
    getArticle: async (_, { Id }, dataSources) => {

      const data = dataSources.articleController.getArticle(Id)
      return data
    },
    articles: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {

      const data = dataSources.articleController.getArticles(pageNo, pageSize, filterText, sortType, sortkey)
      return data
    },
    articleStatuses: async (_, __, dataSources) => {
      const data = dataSources.articleController.getArticlesStatuses()
      return data
    },

    //tags
    articleTags: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
      const data = dataSources.articleController.getArticlesTags(pageNo, pageSize, filterText, sortType, sortkey)
      return data
    },
    getTag: async (_, { Id }, dataSources) => {

      const data = dataSources.articleController.getTag(Id)
      return data
    },
    tagArticles: async (_, { pageNo, pageSize, tagTitle }, dataSources) => {

      const data = dataSources.articleController.getTagArticles(pageNo, pageSize, tagTitle)
      return data
    },



    getInsGroups: async (_, res, dataSources) => {
      return dataSources.insGroupController.getInsGroups()
    },

  },
  Mutation: {

    login: async (_, { username, password }, dataSources) => {
      const data = dataSources.accountController.login(username, password, dataSources)
      return data
    },
    logout: async (_, __, dataSources) => {
      const data = dataSources.accountController.logout(dataSources)
      return data
    },
    changePassword: async (_, { account_id, oldPassword, newPassword }, dataSources) => {
      const data = dataSources.accountController.changePassword(account_id, oldPassword, newPassword, dataSources)
      return data
    },

    createAccount: async (_, { email, password, mobile }, { dataSources }) => {
      const data = dataSources.accountController.createAccount(email, password, mobile)
      return data
    },
    upsertAccount: async (_, { id, username, fullName, password, savedPassword, isActive }, dataSources) => {

      const data = dataSources.accountController.upsertAccount(id, username, fullName, password, savedPassword, isActive, dataSources)
      return data
    },




    createTicket: async (_, { title, description }, dataSources) => {
      const data = dataSources.ticketController.createTicket(title, description, dataSources.mainConfig.account_id)
      return data
    },

    upsertCompany: async (_, { id, title, about, atAGlance, logo, lat, lng, size, website, members, pictures }, dataSources) => {
      const data = dataSources.companyController.upsertCompany(id, title, about, atAGlance, logo, lat, lng, size, website, members, pictures, dataSources)
      return data
    },


    createJob: async (_, { company_id, data }, dataSources) => {
      const job = dataSources.companyController.createJob(company_id, data, dataSources)
      return job
    },

    upsertArticle: async (_, { id, title, description, status, tags, insGroupCodes, files }, dataSources) => {
      console.log('iiiddd=' + dataSources.req.account_id);

      const data = dataSources.articleController.upsertArticle(id, title, description, status, tags, 
        insGroupCodes, files, dataSources)
      return data
    },
    deleteArticle: async (_, { id }, dataSources) => {
      const data = dataSources.articleController.deleteArticle(id, dataSources)
      return data
    },


    //tags
    upsertTag: async (_, { id, title }, dataSources) => {
      const data = dataSources.articleController.upsertTag(id, title, dataSources)
      return data
    },
    deleteTag: async (_, { id }, dataSources) => {
      const data = dataSources.articleController.deleteTag(id, dataSources)
      return data
    },

    singleUpload: async (_, { id, entityType, file }, dataSources) => {
      const data = dataSources.articleController.uploadFile(id, entityType, file, dataSources)
      return data
    },

    saveInsGroups: async (_, { data }, dataSources) => {
      const result = dataSources.insGroupController.save(data, dataSources)
      return result
    },

  }
}


module.exports = resolvers;