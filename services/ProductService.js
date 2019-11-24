const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
let stripe = require('stripe')('sk_test_AHvs5CyJ8YL7E2rHcVrRoOmb00LLHlRzBP');
const transporter = require("./EmailService");
const Basket = require("../models/Basket");
const Wishlist = require("../models/Wishlist");

const ProductService = {

    getById: async (req, res) => {
        try{
            const product = await Product.findById(mongoose.Types.ObjectId(req.params.id)).lean().exec();
            if(!product){
                return res.status(404).send({message: `Product with id ${req.params.id} was not found`});
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
            if(!req.body.quantityType || (req.body.quantityType !== "KG" && req.body.quantityType !== "BUC")){
                return res.status(400).send({message: "Product must have a valid quantity type"});
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
    },

    getAll: async(req, res) => {

        const page = req.query.page;
        const size = req.query.size;
        const sel  = req.query.seller;
        const buy  = req.query.buyer; 

        try{
           let query;
        if(sel){
            query = Product.find({seller: sel});
        } else {
            query = Product.find();
        }
           const products = await query.skip(parseInt(page * size)).limit(parseInt(size)).lean().exec();
           res.status(200).send({products});
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    search: async (req, res) => {

        const page = req.query.page;
        const size = req.query.size;

        try{

        let query = {
            '$and': []
        };

        let search; 
        let queryParams = req.query;
        let nameQuery = [];
        if(queryParams['name']){
            // nameQuery.push({'name': {'$in': queryParams['name']}});
            // query['$and'].push({ nameQuery });
            search = Product.find({name : { $regex: `^.*${queryParams['name']}.*$`, $options: 'i', $options: 'm' }});
            //search.where('name').in(queryParams['name']);
        } else {
            search = Product.find();
        }


        console.log(queryParams);
        let categoryQuery = [];
        if(queryParams['category']){
            // categoryQuery.push({'category': {'$in': queryParams['category']}});
            // query['$and'].push({ categoryQuery });
            search.where('category').in(queryParams['category']);
        }

        let subcategoryQuery = [];
        if(queryParams['subcategory']){
            // subcategoryQuery.push({'subcategory': {'$in': queryParams['subcategory']}});
            // query['$and'].push({ subcategoryQuery });
            search.where('subcategory').in(queryParams['subcategory']);

        }

        let locationQuery = [];
        if(queryParams['location']){
            // locationQuery.push({'location': {'$in': queryParams['location']}});
            // query['$and'].push({ locationQuery });
            search.where('location').in(queryParams['location']);

        }

        let sellerQuery = [];
        if(queryParams['seller']){
            // sellerQuery.push({'seller': {'$in': queryParams['seller']}});
            // query['$and'].push({ sellerQuery });
            search.where('seller').in(queryParams['seller']);

        }

        let priceQuery = [];
        if(queryParams['lowPrice'] && queryParams['highPrice']){
            // priceQuery.push({ 'price': { $gte: + queryParams['lowPrice'], $lte: + queryParams['highPrice'] } });
            // query['$and'].push({ priceQuery });
            search.where('price').lt(queryParams['highPrice']).gt(queryParams['lowPrice']);

        }

        if(queryParams['page'] && queryParams['size']){
            search.skip(parseInt(queryParams['page']) * parseInt(queryParams['size'])).limit(parseInt(queryParams['size']));
        }

        
        console.log(query);

        const prods = await search.exec();
        res.status(200).send({prods});

        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    buyProduct: async(req, res) => {
        try{

            let toUpdateProduct = Product.findById(mongoose.Types.ObjectId(req.body.product));
            let product = await toUpdateProduct.lean().exec();
            let seller  = await User.findById(mongoose.Types.ObjectId(req.body.seller)).lean().exec();

            let basketToUpdate =  Basket.findOne({buyer: req.user._id});
            let basket = await basketToUpdate.lean().exec();
            for (var i = 0; i < basket.products.length; i++){
                let prod = await Product.findById(mongoose.Types.ObjectId(basket.products[i].produs._id)).lean().exec();
                if(prod.available < basket.products[i].amount){
                    return res.status(403).send({message: "You cannot buy more of a product than the seller has"});
                }
            }

            if(!product){
                return res.status(404).send({message: `Product with id ${req.body.product} was not found`});
            }
            if(!seller){
                return res.status(404).send({message: `Seller with id ${req.body.seller} was not found`});
            }

            stripe.charges.create(
                {
                  amount: parseInt(basket.total)  * 100,
                  currency: 'GBP',
                  source: req.body.source,
                  description: `Charge for ${req.user.email} for product ${product.name} from seller ${seller.email}`,
                },
                async function(err, charge) {
                  if(err){
                    console.log(err);
                    let mail = transporter.sendMail({
                        to: req.user.email,
                        subject: "Plata eronata",
                        html: `<p>Plata produselor din partea vanzatorului ${seller.email} a esuat. Te rugam sa incerci din nou.</p>`,
                      });
                    return res.status(400).send({message: err.message});
                  } else{
                    for (var i = 0; i < basket.products.length; i++){
                        const toUpdate =  Product.findById(mongoose.Types.ObjectId(basket.products[i].produs._id));
                        const prod     = await toUpdate.lean().exec();
                        await toUpdate.update({available: prod.available - parseInt(basket.products[i].amount)});
                    }
                    await basketToUpdate.update({current: false, boughtAt: new Date()});
                    let mail = transporter.sendMail({
                        to: req.user.email,
                        subject: "Confirmare plata",
                        html: `<p>Plata produselor din partea vanzatorului ${seller.email} a fost acceptata.</p>`,
                      });
                    res.status(201).send({'charge': charge});
                  }
                }
              );

        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    updateWishlist: async(req, res) => {
        try{

            const buyerId = req.params.id;
            const toUpdate = Wishlist.findOne({buyer: buyerId});
            const wishlist = await toUpdate.lean().exec();
            console.log(req.body.product);
            if(!wishlist){
                let wsh = new Wishlist({products: req.body, buyer: buyerId});
                console.log(wsh);
                wsh.save().then(toDb => {
                    res.status(201).send({message: "Item saved to wishlist"});
                }).catch(err => {
                    console.log(err);
                    res.status(400).send({message: "Unable to add item to wishlist"});
                });
            } else{
                wishlist.products.push(req.body.product);
                await toUpdate.update({products: wishlist.products});
                res.status(200).send({message: "Item added to wishlist successfully"});
            }
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    getWishlist: async(req, res) => {
        try{

            const buyerId = req.params.id;

            const wishlist = await Wishlist.findOne({buyer: buyerId}).lean().exec();
            if(!wishlist){
                return res.status(404).send({message: `Wishlist for buyer ${buyerId} was not found`});
            }
            var prodList = [];
            for(var i = 0; i < wishlist.products.length; i++){
                console.log(wishlist.products[i].product);
                let prod = await Product.findById(mongoose.Types.ObjectId(wishlist.products[i].product)).lean().exec();
                prodList.push(prod);
            }

            res.status(200).send({list: prodList, buyer: buyerId});

        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },

    removeFromWishlist: async(req, res) => {
        try{
            const wshId = req.params.id;
            const toUpdate = Wishlist.findById(mongoose.Types.ObjectId(wshId));
            const wishlist = await toUpdate.lean().exec();

            if(!wishlist){
                return res.status(404).send({message: `Wishlist with id ${wshId} was not found`});
            }
            for(var i = 0; i < wishlist.products.length; i++){
                if(wishlist.products[i].product == req.body.product){
                    wishlist.products.splice(i, 1);
                    await toUpdate.update({products: wishlist.products});
                    return res.status(200).send({newWishlist: wishlist});
                }
            }
            res.status(200).send({});
        }catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    }

}

module.exports = ProductService; 