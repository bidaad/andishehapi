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

  const path = require('path');
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use((req:any, _:any, next:any) => {
    //console.log(req.cookies);
    //console.log('server1');
    
    const accessToken = req.cookies['access-token']
    try {
      //console.log('my accessToken=' + accessToken);
      if(accessToken !== '')
      {
      const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any
      //console.log('data userid = ' + data.account_id);

      (req as any).account_id = data.account_id;
      }
      //console.log('server2');

    } catch(err) {
      //console.log(err);
      //console.log('error verify');
      
     }
    next();
  })
  app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

  server.applyMiddleware({ app, cors: corsOptions });
  //server.graphqlPath = '/'


  app.get('/', (req:any, res:any) => {
    res.send('Andisheh API')
});

const port = process.env.port || 8000;
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

}

startServer();
