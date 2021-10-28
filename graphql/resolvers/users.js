const bcrypt = require("bcrypt");

const User = require("../../models/user");

module.exports = {
    Mutation: {
        createUser: async (root, args, context, info) => {
            try {
                const { email, password } = args.userInput
                console.log(email)
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
    }
}