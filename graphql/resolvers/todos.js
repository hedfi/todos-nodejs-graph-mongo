const Todo = require("../../models/todo");
const defaultLimit = require('../../config').PER_PAGE_DEFAULT

module.exports = {
    Query: {
        todos: async (root, args, context, info) =>
        {
            let skip = 0
            let limit = defaultLimit
            let orderField = 'createdAt'
            let orderBy = 'asc'
            if(context.query && context.query.skip) skip = parseInt(context.query.skip)
            if(context.query && context.query.limit) limit = parseInt(context.query.limit)
            if(context.query && context.query.orderField) orderField = context.query.orderField
            if(context.query && context.query.orderBy) orderBy = context.query.orderBy

            let methodSort = { [orderField]: orderBy };
            if (!context.isAuth) {
                throw new Error('Unauthenticated!');
            }
            return await Todo.find({ user : context.user.aud }).sort(methodSort).skip(skip).limit(limit);
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