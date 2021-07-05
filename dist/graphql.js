"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const schema_1 = require("./schema");
const dataSource_1 = require("./dataSource");
const jsonwebtoken_1 = require("jsonwebtoken");
const express_1 = require("express");
const express = require("express");
const cors = require('cors');
const corsOptions = {
    origin: [
        "http://172.16.16.202",
        "http://172.16.16.202:3000"
    ],
    credentials: true
};
const startServer = async () => {
    await mongoose_1.default.connect(config_1.DBCONNECTION, { useNewUrlParser: true });
    const server = new apollo_server_express_1.ApolloServer({
        schema: schema_1.schema,
        playground: {
            cdnUrl: 'http://172.16.16.202:5678',
            version: "1.0.0"
        },
        context: dataSource_1.dataSources
    });
    const app = express();
    //app.use( cors() );
    app.use(cookie_parser_1.default());
    const path = require('path');
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    app.use(express_1.json({ limit: '4mb' }));
    //app.use(cors(corsOptions));
    //server.graphqlPath = '/'
    app.use((req, _, next) => {
        console.log('server1');
        const accessToken = req.cookies['access-token'];
        try {
            console.log('token=' + accessToken);
            if (accessToken !== '' && accessToken !== undefined) {
                const data = jsonwebtoken_1.verify(accessToken, config_1.ACCESS_TOKEN_SECRET);
                req.account_id = data.account_id;
            }
        }
        catch (err) {
            console.log(err);
        }
        next();
    });
    server.applyMiddleware({ app, cors: corsOptions });
    app.get('/', (req, res) => {
        res.send('Andisheh API');
    });
    const port = process.env.port || 4000;
    app.listen(port, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
};
startServer();
