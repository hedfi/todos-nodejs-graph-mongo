const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Todo = require('./models/todo');
const User = require('./models/user');

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
        type User {
          id: ID!
          email: String!
          createdAt: String
          updatedAt: String
        }
        
        input TodoInput {
          title: String!
          description: String
        }
        input UserInput {
          email: String!
          password: String!
        }
        
        type RootQuery {
            todos: [Todo!]!
        }
        type RootMutation {
            createTodo(title: String, description: String): Todo
            createUser(userInput: UserInput): User
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
                } catch (err) {
                    throw err;
                }
            },
            createUser: async (args) => {
                try {
                    const { email, password } = args.userInput
                    const hashedPassword = await bcrypt.hash(password, 12);
                    let user = new User({
                        email,
                        password: hashedPassword
                    })
                    return user.save();
                } catch (err) {
                    throw err;
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