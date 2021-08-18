import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { DBCONNECTION, ACCESS_TOKEN_SECRET } from "./config";
import { schema } from './schema'
import { dataSources } from './dataSource'
import { verify } from 'jsonwebtoken'
import { json } from "express";

const express = require("express");
const cors = require('cors')
const corsOptions = {
  origin: [
    "http://172.16.16.202",
    "http://172.16.16.202:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5000"
  ],
  credentials: true
}

const startServer = async () => {

  await mongoose.connect(DBCONNECTION, { useNewUrlParser: true });

  const server = new ApolloServer({
    schema,
    playground: {
      cdnUrl: 'http://127.0.0.1:5678',
      version: "1.0.0"
    },
    context: dataSources

  })
  const app = express();

  //app.use( cors() );
  app.use(cookieParser());

  const path = require('path');
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use(json({ limit: '4mb' }));
  
  //app.use(cors(corsOptions));


  //server.graphqlPath = '/'
  app.use((req: any, _: any, next: any) => {
    //console.log('server1');
    
    const accessToken = req.cookies['access-token']
    try {
      //console.log('token='+ accessToken);
      if (accessToken !== '' && accessToken !== undefined) {
        const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any
        
        (req as any).account_id = data.account_id;
        (req as any).classification = data.classification;
        
      }

    } catch (err) {
      //console.log(err);
      
    }
    next();
  })

    server.applyMiddleware({ app, cors:corsOptions });
  app.get('/', (req: any, res: any) => {
    res.send('Andisheh API')
  });

  const port = process.env.port || 4000;
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

}

startServer();
