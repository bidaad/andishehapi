import { IResolvers } from 'apollo-server'

const resolvers: IResolvers = {
    Query: {
       
      accounts: async (_, { pageNo }, { dataSources }) => {
        const data = dataSources.accountController.getAccounts(pageNo)
        return data
      },
      tickets: async (_, { pageNo }, { dataSources }) => {
        const data = dataSources.ticketController.getTickets(pageNo)
        return data
      }
    },
    Mutation: {
      createAccount: async (_, { email, password, mobile }, { dataSources }) => {
  
        const data = dataSources.accountController.createAccount(email, password, mobile)
        return data
      },
      createTicket: async (_, { title, description }, { dataSources }) => {
        dataSources.mainConfig.incAccountId();
        const data = dataSources.ticketController.createTicket(title, description, dataSources.mainConfig.account_id)
        return data
      }
    }
  }


  module.exports = resolvers;