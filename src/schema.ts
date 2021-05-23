import { gql, IResolvers, makeExecutableSchema } from 'apollo-server'
var resolvers = require('./resolvers');
var typeDefs = require('./typeDefs');


const mongoose = require('mongoose');

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
