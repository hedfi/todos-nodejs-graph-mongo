const todosResolver = require('./todos');
const authResolver = require('./auth');

const resolvers = [todosResolver, authResolver]

module.exports = resolvers;