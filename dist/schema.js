"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const apollo_server_1 = require("apollo-server");
var resolvers = require('./resolvers');
var typeDefs = require('./typeDefs');
const mongoose = require('mongoose');
exports.schema = apollo_server_1.makeExecutableSchema({
    typeDefs,
    resolvers
});
