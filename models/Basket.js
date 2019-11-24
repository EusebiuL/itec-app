
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
    },
    current: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
}, {
    collection: 'baskets',
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model("Basket", Basket);