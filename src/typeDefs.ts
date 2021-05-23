import { gql } from 'apollo-server'

const typeDefs = gql`
  

  type Account {
    id: String!
    email: String
    account_id: Int
    password: String
    mobile: String
    active: Boolean
    challenge_code: String
    verified: Boolean
  }

  type Ticket {
    id: String!
    title: String
    description: String
    date: String
    status: String
  }


  type Query {
    accounts(pageNo: Int): [Account]
    tickets(pageNo: Int): [Ticket]
  }

  type Mutation {
    createAccount(email: String, password: String, mobile: String): Account!
    createTicket(title: String, description: String): Ticket!
  }
`

module.exports = typeDefs