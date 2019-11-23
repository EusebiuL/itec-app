
const mongoose = require("mongoose");
const mongooseFindAndFilter = require('mongoose-find-and-filter');

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    quantityType:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {
    collection: 'products',
    versionKey: false
});

module.exports = mongoose.model("Product", Product);