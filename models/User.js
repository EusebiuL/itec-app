
const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    buyerType: {
        type: String
    },
    sellerType: {
        type: String
    },
    image: {
        type: String
    }
}, {
    collection: 'users',
    versionKey: false
});

module.exports = mongoose.model("User", User);