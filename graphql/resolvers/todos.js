const Todo = require("../../models/todo");
const defaultLimit = require('../../config').PER_PAGE_DEFAULT

module.exports = {
    Query: {
        todos: async (root, args, context, info) =>
        {
            const skip = parseInt(context.body.variables.skip) || 0
            const limit = parseInt(context.body.variables.limit) || defaultLimit
            const orderField = context.body.variables.orderField || 'createdAt'
            const orderBy = context.body.variables.orderBy || 'asc'
            const methodSort = { [orderField]: orderBy };
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            const completed = context.body.variables.completed || ''

            const query = { user : context.user.aud }
            if(completed) query.completed = completed
            const countTodos = await Todo.count(query);
            const todos = await Todo.find(query).sort(methodSort).skip(skip).limit(limit);
            return { count: countTodos, todos: todos }
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
        },
        editTodo: async (root, args, context, info) => {
            const { todoId, title, description, completed } = args
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            try {
                const payload = {}
                let currentTodo = await Todo.findOne({ _id: todoId, user: context.user.aud})
                if(!currentTodo) {
                    throw new Error('The resource was not found!');
                }
                if(title) payload.title = title
                if(description) payload.description = description
                if(completed != undefined) payload.completed = completed
                return await Todo.findByIdAndUpdate(todoId, payload, {
                    new: true
                });
            } catch (err) {
                throw err;
            }
        },
        deleteTodo: async (root, args, context, info) => {
            const { todoId } = args
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            try {
                let currentTodo = await Todo.findOne({ _id: todoId, user: context.user.aud})
                console.log(currentTodo)
                if(!currentTodo) {
                    throw new Error('The resource was not found!');
                }
                return await Todo.findByIdAndDelete(todoId)
            } catch (err) {
                throw err;
            }
        }
    }
}