const usersResolver = require('./users');
const todosResolver = require('./todos');

const resolvers = {
    Query: {
        ...todosResolver.Query,
    },
    Mutation: {
        ...usersResolver.Mutation,
        ...todosResolver.Mutation,
    }
};

module.exports = resolvers;