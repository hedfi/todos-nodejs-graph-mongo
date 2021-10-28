const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
        type RootQuery {
            todos: [String!]!
        }
        type RootMutation {
            createTodo(title: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
        rootValue: {
            todos: () => {
                return ['Meet George', 'Buy eggs', 'Read a book', 'Organize office'];
            },
            createTodo: ({ title }) => {
                return title;
            }
        },
        graphiql: true
    })
);

app.listen(3000);