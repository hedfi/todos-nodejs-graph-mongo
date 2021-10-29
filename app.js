const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware')

const typeDefs = require('./graphql/schema/');
const resolvers = require('./graphql/resolvers/');

const apiKey = require('./middlewares/apiKey');
const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
app.use(auth)

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const schemaWithMiddleware = applyMiddleware(executableSchema, apiKey)

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schemaWithMiddleware,
        graphiql: true
    })
);

mongoose
    .connect(`mongodb://localhost:27017/todos_bd`)
    .then(() => {
        app.listen(3000);
        console.log('Running a GraphQL API server at http://localhost:3000/graphql');
    })
    .catch(err => {
        console.log(err);
    });