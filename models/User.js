
const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
    email: {
        tpye: String
    }
});

module.exports = mongoose.model("User", User);