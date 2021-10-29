const Todo = require("../../models/todo");

module.exports = {
    Query: {
        todos: async (root, args, context, info) => {
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            return await Todo.find({ user : context.user.aud });
        },
    },
    Mutation: {
        createTodo: async (root, args, context, info) => {
            const { title, description } = args
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            try {
                const todo = new Todo({
                    title,
                    description,
                    user: context.user.aud
                });
                return await todo.save()
            } catch (err) {
                throw err;
            }
        }
    }
}