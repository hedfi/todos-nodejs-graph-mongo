const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    createdTodos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
}, { timestamps: true });

userSchema.path('email').validate(async function (email) {
    const emailCount = await mongoose.models['User'].count({email});
    return !emailCount;
}, 'already exists in the database.');


module.exports = mongoose.model('User', userSchema);