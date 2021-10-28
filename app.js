const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const todos = [];

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
        type Todo {
          title: String!
          description: String
          date: String!
          completed: Boolean!
        }
        input TodoInput {
          title: String!
          description: String
        }
        
        type RootQuery {
            todos: [Todo!]!
        }
        type RootMutation {
            createTodo(title: String, description: String): Todo
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
        rootValue: {
            todos: () => {
                return todos;
            },
            createTodo: ({ title, description }) => {
                const todo = {
                    title,
                    description,
                    date: new Date().toISOString(),
                    completed: false
                };
                todos.push(todo);
                return todo;
            }
        },
        graphiql: true
    })
);

app.listen(3000);