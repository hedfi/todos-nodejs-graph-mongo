const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const appSecret = require('../../config').APP_SECRET

const User = require("../../models/user");
const utils = require("../../common/utils");

function issueToken (userId, issuer, provider) {
    return new Promise((resolve, reject) => {
        process.nextTick(function () {
            let id = utils.generateRandomId(64)
            let payload = { provider: provider }
            jwt.sign(payload, appSecret, {
                expiresIn: '365 days',
                audience: userId,
                issuer: issuer,
                jwtid: id
            }, function (err, token) {
                if (err) { reject(err) } else {
                    // assign new token to user
                    User.findByIdAndUpdate(userId, { $set: { jwtId: id } })
                        .then(_ => {
                            resolve(token)
                        }, err => {
                            reject(err)
                        })
                }
            })
        })
    })
}

module.exports = {
    Mutation: {
        createUser: async (root, args, context, info) => {
            try {
                const { email, password } = args.userInput
                const hashedPassword = await bcrypt.hash(password, 12);
                let user = new User({
                    email,
                    password: hashedPassword
                })
                await user.save()
                let token = await issueToken(user.id, '/graphql/createUser', 'local')
                return { token: token, user: user }
            } catch (err) {
                throw err;
            }
        },
        loginUser: async (root, args, context, info) => {
            const { email, password } = args.userInput
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }
            let token = await issueToken(user.id, '/graphql/loginUser', 'local')
            return { token: token, user: user }
        }
    }
}