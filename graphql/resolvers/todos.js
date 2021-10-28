const Todo = require("../../models/todo");

module.exports = {
    Query: {
        todos: async () => {
            return await Todo.find();
        },
    },
    Mutation: {
        createTodo: async (root, args, context, info) => {
            const { title, description } = args
            try {
                const todo = new Todo({
                    title,
                    description
                });
                return await todo.save()
            } catch (err) {
                throw err;
            }
        }
    }
}