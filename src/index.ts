import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { DBCONNECTION, ACCESS_TOKEN_SECRET } from "./config";
import { schema } from './schema'
import { dataSources } from './dataSource'
import { verify } from 'jsonwebtoken'
const express = require("express");
const cors = require('cors')
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
}

const startServer = async () => {

  await mongoose.connect(DBCONNECTION, { useNewUrlParser: true });

  const server = new ApolloServer({
    schema,
    context: dataSources

  })
  const app = express();
  //app.use( cors() );
  app.use(cookieParser());

  
  app.use((req, _, next) => {
    //console.log(req.cookies);
    const accessToken = req.cookies['access-token']
    try {
      //console.log('my accessToken=' + accessToken);

      const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any
      //console.log('data userid = ' + data.account_id);

      (req as any).account_id = data.account_id;
    } catch {
      //console.log('error verify');
      
     }
    next();
  })
  app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

  server.applyMiddleware({ app, cors: corsOptions });


  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

}

startServer();
