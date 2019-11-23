
const mongoose = require("mongoose");
const User = require("../models/Product");
const Basket = require("../models/Basket");
const Product = require("../models/Product");


const BasketService = {
    updateBasket: async(req, res) => {
        try {
            if(!req.body.buyer){
                return res.status(404).send({message: "There must be a buyer for basket"});
            }
            const toUpdate = Basket.findOne({buyer: req.body.buyer, current: true});
            let basket     = await toUpdate.lean().exec(); 
            let prodList = [];
            products = req.body.prid;
            for (var i = 0; i < products.length; i++){
                let prod = await Product.findById(mongoose.Types.ObjectId(products[i].prodid)).lean().exec(); 
                prodList.push({produs: prod, amount: products[i].amount});
            }
            if(!basket){
                let newBasket = new Basket({...req.body, current: true});
                console.log(newBasket);
                let sum = 0;
                for (var i = 0; i < prodList.length; i++){
                    sum += parseFloat(prodList[i].produs.price) * parseFloat(prodList[i].amount);
                }
                newBasket.total = sum;
                newBasket.save().then(async toDb => {
                    await toDb.update({products: prodList});
                    console.log(toDb);
                    return res.status(201).send({'basket': toDb});
                }).catch(err => {
                    console.log(err);
                    return res.status(400).send({message: "Unable to save basket"});
                });
            } else{
                let sum = 0;
                for (var i = 0; i < prodList.length; i++){
                    sum += parseFloat(prodList[i].produs.price) * parseFloat(prodList[i].amount);
                }
                await toUpdate.update({products: prodList, total: sum});
                let p = await Basket.findById(mongoose.Types.ObjectId(basket._id)).lean().exec();
                return res.status(200).send({cos: p});
            }
            
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    getById: async(req, res) => {
        try{
            const basket = await Basket.findById(mongoose.Types.ObjectId(req.params.id)).lean().exec();
            if(!basket){
                return res.status(404).send({message: `Basket with id ${req.params.id} was not found`});
            } else {
                res.status(200).send({basket});
            }
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    getByBuyer: async(req, res) => {
        try{

            const basket = await Basket.find({buyer: req.params.id}).lean().exec();
            if(!basket){
                return res.status(404).send({message: `Basket for buyer ${req.params.id} was not found`});
            } else {
                res.status(200).send({basket});
            }

        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    }
}


module.exports = BasketService;