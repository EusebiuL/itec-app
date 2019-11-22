const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

const ProductService = {

    getById: async (req, res) => {
        try{
            const product = await Product.findById(mongoose.Types.ObjectId(req.params.id)).lean().exec();
            if(!product){
                return res.stauts(404).send({message: `Product with id ${req.params.id} was not found`});
            } else {
                res.status(200).send({product});
            }
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    }, 

    add: async(req, res) => {
        try{
            if(req.user.userType !== "SELLER"){
                return res.status(403).send({message: "Buyers cannot add products!"});
            }
            console.log(req.user._id);
            console.log(req.body.seller);
            if(req.user._id != req.body.seller){
                return res.status(403).send({message: "You cannot add a product to another seller!"});
            }

            const prod = await Product.findOne({name: req.body.name}).lean().exec();
            if(prod && prod.seller === req.body.seller){
                return res.status(403).send({message: "There already is a product with the same name at this seller"});
            } else {

                const product = new Product(req.body);
                product.save().then(toDb => {
                    res.status(201).send({'product': product});
                }).catch(err => {
                    console.log(err);
                    res.status(400).send({message: "Unable to save product"});
                });
            }

        } catch(error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    }
}

module.exports = ProductService; 