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
            res.status(400).send({message: error.message});
        }
    },

    update: async (req, res) => {
        try{
            const prod = await Product.findOne({_id: req.params.id}).exec();
            if(!prod){
                return res.status(404).send({message: `Product with id ${req.params.id} was not found`});
            }
            if(req.user._id != prod.seller){
                return res.status(403).send({message: "You cannot update another seller's product!"});
            }
            const namedProd = await Product.findOne({name: req.body.name}).lean().exec();
            if(namedProd && namedProd._id !== prod._id){
                return res.status(403).send({message: `There already is different product with name ${req.body.name}`});
            }
            await prod.update(req.body);
            res.status(200).send({product: prod});
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    delete: async(req, res) => {
        try{

            const toDelete = await Product.findById(mongoose.Types.ObjectId(req.params.id)).exec();
            if(req.user._id != toDelete.seller){
                return res.status(403).send({message: "You cannot delete another seller's product"});
            }
            await toDelete.remove();
            res.status(200).send({"product": toDelete});
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    }
}

module.exports = ProductService; 