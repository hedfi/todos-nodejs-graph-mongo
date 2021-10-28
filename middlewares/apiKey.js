const apiKey = require('../config').API_KEY

module.exports = async function (resolve, root, args, context, info) {
    let headerApiKey = context.header('x-api-key') || context.query.api_key
    if (headerApiKey === apiKey) {
        return await resolve(root, args, context, info)
    } else {
        throw new Error('API key is invalid.');
    }
}