"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers = {
    //FileUpload: GraphQLUpload,
    Query: {
        me: async (_, res, dataSources) => {
            //console.log(dataSources.req);
            if (!dataSources.req.account_id)
                return null;
            return dataSources.accountController.getCurrentAccount(dataSources.req.account_id);
        },
        accounts: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
            const data = dataSources.accountController.getAccounts(pageNo, pageSize, filterText, sortType, sortkey);
            return data;
        },
        getAccount: async (_, { Id }, dataSources) => {
            const data = dataSources.accountController.getAccountById(Id);
            return data;
        },
        //articles
        getArticle: async (_, { Id }, dataSources) => {
            const data = dataSources.articleController.getArticle(Id);
            return data;
        },
        articles: async (_, { pageNo, pageSize, filterText, sortType, sortkey, zone }, dataSources) => {
            const data = dataSources.articleController.getArticles(pageNo, pageSize, filterText, sortType, sortkey, zone);
            return data;
        },
        advancedSearchArticle: async (_, { pageNo, pageSize, title, description, source, author, articleStatus, selectedZone, articleFromDate, articleToDate }, dataSources) => {
            const data = dataSources.articleController.advancedSearchArticle(pageNo, pageSize, title, description, source, author, articleStatus, selectedZone, articleFromDate, articleToDate, dataSources);
            return data;
        },
        articleStatuses: async (_, __, dataSources) => {
            const data = dataSources.articleController.getArticlesStatuses();
            return data;
        },
        articleCountsByDate: async (_, {}, dataSources) => {
            const data = dataSources.articleController.articleCountsByDate();
            return data;
        },
        getArticleStatus: async (_, { Id }, dataSources) => {
            const data = dataSources.articleController.getArticleStatus(Id);
            return data;
        },
        zones: async (_, __, dataSources) => {
            const data = dataSources.articleController.getZones();
            return data;
        },
        getZone: async (_, { Id }, dataSources) => {
            const data = dataSources.articleController.getZone(Id);
            return data;
        },
        //tags
        articleTags: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
            const data = dataSources.articleController.getArticlesTags(pageNo, pageSize, filterText, sortType, sortkey);
            return data;
        },
        getTag: async (_, { Id }, dataSources) => {
            const data = dataSources.articleController.getTag(Id);
            return data;
        },
        tagArticles: async (_, { pageNo, pageSize, tagTitle }, dataSources) => {
            const data = dataSources.articleController.getTagArticles(pageNo, pageSize, tagTitle);
            return data;
        },
        getInsGroups: async (_, res, dataSources) => {
            return dataSources.insGroupController.getInsGroups();
        },
        //Access Groups and Resources
        getAccessGroup: async (_, { Id }, dataSources) => {
            const data = dataSources.accessGroupController.getAccessGroup(Id);
            return data;
        },
        accessGroups: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
            const data = dataSources.accessGroupController.getAccessGroups(pageNo, pageSize, filterText, sortType, sortkey, dataSources);
            return data;
        },
        getResource: async (_, { Id }, dataSources) => {
            const data = dataSources.accessGroupController.getResource(Id);
            return data;
        },
        resources: async (_, { pageNo, pageSize, filterText, sortType, sortkey }, dataSources) => {
            const data = dataSources.accessGroupController.getResources(pageNo, pageSize, filterText, sortType, sortkey, dataSources);
            return data;
        },
        //Hardcodes
        classifications: async (_, __, dataSources) => {
            const data = dataSources.hardcodeController.getClassifications();
            return data;
        },
        getClassification: async (_, { Id }, dataSources) => {
            const data = dataSources.hardcodeController.getClassification(Id);
            return data;
        },
    },
    Mutation: {
        login: async (_, { username, password }, dataSources) => {
            const data = dataSources.accountController.login(username, password, dataSources);
            return data;
        },
        logout: async (_, __, dataSources) => {
            const data = dataSources.accountController.logout(dataSources);
            return data;
        },
        changePassword: async (_, { account_id, oldPassword, newPassword }, dataSources) => {
            const data = dataSources.accountController.changePassword(account_id, oldPassword, newPassword, dataSources);
            return data;
        },
        createAccount: async (_, { email, password, mobile }, { dataSources }) => {
            const data = dataSources.accountController.createAccount(email, password, mobile);
            return data;
        },
        upsertAccount: async (_, { id, username, fullName, password, savedPassword, isActive, role, zone, accessGroups, classification }, dataSources) => {
            const data = dataSources.accountController.upsertAccount(id, username, fullName, password, savedPassword, isActive, role, zone, accessGroups, classification, dataSources);
            return data;
        },
        deleteAccount: async (_, { id }, dataSources) => {
            const data = dataSources.accountController.deleteAccount(id, dataSources);
            return data;
        },
        createTicket: async (_, { title, description }, dataSources) => {
            const data = dataSources.ticketController.createTicket(title, description, dataSources.mainConfig.account_id);
            return data;
        },
        upsertCompany: async (_, { id, title, about, atAGlance, logo, lat, lng, size, website, members, pictures }, dataSources) => {
            const data = dataSources.companyController.upsertCompany(id, title, about, atAGlance, logo, lat, lng, size, website, members, pictures, dataSources);
            return data;
        },
        createJob: async (_, { company_id, data }, dataSources) => {
            const job = dataSources.companyController.createJob(company_id, data, dataSources);
            return job;
        },
        upsertArticle: async (_, { id, title, description, status, tags, insGroupCodes, files, zones, creatorName, author, source, articleDate, classification }, dataSources) => {
            const data = dataSources.articleController.upsertArticle(id, title, description, status, tags, insGroupCodes, files, zones, creatorName, author, source, articleDate, classification, dataSources);
            return data;
        },
        addComment: async (_, { articleId, desc }, dataSources) => {
            const data = dataSources.articleController.addComment(articleId, desc, dataSources);
            return data;
        },
        deleteArticle: async (_, { id }, dataSources) => {
            const data = dataSources.articleController.deleteArticle(id, dataSources);
            return data;
        },
        upsertArticleStatus: async (_, { id, title }, dataSources) => {
            const data = dataSources.articleController.upsertArticleStatus(id, title, dataSources);
            return data;
        },
        deleteArticleStatus: async (_, { id }, dataSources) => {
            const data = dataSources.articleController.deleteArticleStatus(id, dataSources);
            return data;
        },
        upsertZone: async (_, { id, title }, dataSources) => {
            const data = dataSources.articleController.upsertZone(id, title, dataSources);
            return data;
        },
        deleteZone: async (_, { id }, dataSources) => {
            const data = dataSources.articleController.deleteZone(id, dataSources);
            return data;
        },
        //tags
        upsertTag: async (_, { id, title }, dataSources) => {
            const data = dataSources.articleController.upsertTag(id, title, dataSources);
            return data;
        },
        deleteTag: async (_, { id }, dataSources) => {
            const data = dataSources.articleController.deleteTag(id, dataSources);
            return data;
        },
        singleUpload: async (_, { id, entityType, file }, dataSources) => {
            const data = dataSources.articleController.uploadFile(id, entityType, file, dataSources);
            return data;
        },
        saveInsGroups: async (_, { data }, dataSources) => {
            const result = dataSources.insGroupController.save(data, dataSources);
            return result;
        },
        // Access Groups
        upsertAccessGroup: async (_, { id, title, resourceAccesses }, dataSources) => {
            const data = dataSources.accessGroupController.upsertAccessGroup(id, title, resourceAccesses, dataSources);
            return data;
        },
        deleteAccessGroup: async (_, { id }, dataSources) => {
            const data = dataSources.accessGroupController.deleteAccessGroup(id, dataSources);
            return data;
        },
        upsertResource: async (_, { id, title, engTitle, path }, dataSources) => {
            const data = dataSources.accessGroupController.upsertResource(id, title, engTitle, path, dataSources);
            return data;
        },
        //Hardcodes
        upsertClassification: async (_, { id, title, rank }, dataSources) => {
            const data = dataSources.hardcodeController.upsertClassification(id, title, rank, dataSources);
            return data;
        },
        deleteClassification: async (_, { id }, dataSources) => {
            const data = dataSources.hardcodeController.deleteClassification(id, dataSources);
            return data;
        },
    }
};
module.exports = resolvers;
