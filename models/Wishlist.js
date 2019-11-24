
const mongoose = require("mongoose");

const Wishlist = new mongoose.Schema({
    products:{
        type: Array,
        required: true
    },
    buyer: {
        type: String,
        required: true
    }
}, {
    collection: 'wishlists',
    versionKey: false,
});

module.exports = mongoose.model("Wishlist", Wishlist);