
const mongoose = require("mongoose");

const Basket = new mongoose.Schema({
    products:{
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    buyer: {
        type: String,
        required: true
    }
}, {
    collection: 'baskets',
    versionKey: false
});

module.exports = mongoose.model("Basket", Basket);