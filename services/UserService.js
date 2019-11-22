
const mongoose = require("mongoose");
const uuidv4 = require('uuidv4');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const salt = 10;

const UserService = {

    login: async (req, res) => {
        try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            bcrypt.compare(req.body.password, user.password, async function(err, result){
                if(result === true){
                    const authToken = uuidv4.uuid();
                    await user.updateOne({token: authToken});
                    const updated = await User.findOne({email: user.email});
                    res.send({updated, authToken});
                } else {
                    res.status(403).json({message: 'Wrong email or password'});
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'error'});
    }
    
},

    register: async (req, res, next) => {
        try{

            const user = await User.findOne({email: req.body.email});
            if(!user){

                if(req.body.userType === "SELLER" && (!req.body.sellerType || req.body.buyerType)){
                    return res.status(400).send({message: "Seller cannot have buyer type"});
                }  else if(req.body.userType === "BUYER" && (!req.body.buyerType || req.body.sellerType)){
                    return res.status(400).send({message: "Buyer cannot have seller type"});
                }
                
                
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    if(err){
                        return res.status(400).send({message: "Error when creating user"});
                    } else {
                        let toRegisterUser = new User(req.body);
                        toRegisterUser.password = hash;
                        //let hashedUser = new User(password = hash);
                        toRegisterUser.save().then(toDb => {
                            return res.status(201).send({ 'user': toRegisterUser });
                            }).catch(err => {
                            console.log(err);
                            return res.status(400).send("unable to save user to database");
                        });
                    }
                  });
                

            } else {
                res.status(403).send({message: `There already is a user with email ${req.body.email}`});
            }


        } catch (error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    }



}

module.exports = UserService;