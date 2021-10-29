const typeDefs = `
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
        type AuthData {
          user: User!
          token: String!
        }
        
        input TodoInput {
          title: String!
          description: String
        }
        input UserInput {
          email: String!
          password: String!
        }
        
        type Query {
            todos: [Todo!]!
        }
        type Mutation {
            createTodo(title: String, description: String): Todo
            createUser(userInput: UserInput): AuthData
            loginUser(userInput: UserInput): AuthData
        }
        schema {
            query: Query
            mutation: Mutation
        }
    `
module.exports = typeDefs;