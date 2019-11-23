
const mongoose = require("mongoose");
const uuidv4 = require('uuidv4');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const salt = 10;
const transporter = require("./EmailService");

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
        } else {
            res.status(404).send({message: `User with email ${req.body.email} does not exist`});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: 'error'});
    }
    
},

    register: async (req, res) => {
        try{

            const user = await User.findOne({email: req.body.email});
            if(!user){

                if(req.body.userType === "SELLER" && (!req.body.sellerType || req.body.buyerType)){
                    return res.status(400).send({message: "Seller cannot have buyer type"});
                }  else if(req.body.userType === "BUYER" && (!req.body.buyerType || req.body.sellerType)){
                    return res.status(400).send({message: "Buyer cannot have seller type"});
                }
                
                
                bcrypt.hash(req.body.password, salt, function(err, hash) {

                    if(err){
                        return res.status(400).send({message: "Error when creating user"});
                    } else {
                        let toRegisterUser = new User(req.body);
                        toRegisterUser.password = hash;
                        toRegisterUser.save().then(toDb => {
                            let mail = transporter.sendMail({
                                to: req.body.email,
                                subject: "Platforma Fresh Market",
                                html: `<p>Bun venit pe platforma Fresh Market, ${req.body.name}</p>`,
                              });
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
    },

    getUsers: async (req, res) => {
        const page = req.query.page;
        const size = req.query.size;

        try{
             
            const users = await User.find().skip(parseInt(page * size)).limit(parseInt(size)).lean().exec();
            res.status(200).send({users});
        } catch(error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    },

    getSellers: async (req, res) => {

        const page = req.query.page;
        const size = req.query.size;

        try{

            const sellers = await User.find({userType: "SELLER"}).skip(parseInt(page * size)).limit(parseInt(size)).lean().exec();
            res.status(200).send({sellers});

        }catch(error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    },

    getBuyers: async(req, res) => {

        const page = req.query.page;
        const size = req.query.size;

        try{

            const buyers = await User.find({userType: "BUYER"}).skip(parseInt(page * size)).limit(parseInt(size)).lean().exec();
            res.status(200).send({buyers});
        }catch(error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    },

    getById: async(req, res) => {
        try{

            const user = await User.findOne({_id: req.params.id}).lean().exec();
            if(!user){
                return res.status(404).send({message: "User not found"});
            } else {
                res.status(200).send({user: user});
            }
        }catch(error){
            console.log(error);
            res.status(400).send({message: 'error'});
        }
    }

}

module.exports = UserService;