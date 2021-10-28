const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Todo = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
        type Todo {
          id: ID!
          title: String!
          description: String
          completed: Boolean!
          createdAt: String
          updatedAt: String
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
            todos: async () => {
                return await Todo.find();
            },
            createTodo: async ({title, description}) => {
                try {
                    const todo = new Todo({
                        title,
                        description
                    });
                    return await todo.save()
                } catch (e) {
                    console.log(e)
                    throw e;
                }
            }
        },
        graphiql: true
    })
);

mongoose
    .connect(`mongodb://localhost:27017/todos_bd`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });