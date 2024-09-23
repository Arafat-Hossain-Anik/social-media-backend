const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: []
        },
        friendRequest: {
            type: Array,
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)
const User = mongoose.model('users', userSchema)
module.exports = User