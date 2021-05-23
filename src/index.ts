import { ApolloServer } from 'apollo-server'
import mongoose from "mongoose";

var config = require('../config.js');
import { schema } from './schema'
import { dataSources } from './dataSource'


const server = new ApolloServer({ schema, dataSources })
const startServer = async () => {
  await mongoose.connect(config.dbConnection, { useNewUrlParser: true });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

startServer();
