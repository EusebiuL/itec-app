const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const s3 = require("./S3Service");
const multer  = require('multer')
var fs = require('fs');

 function getByteArray(filePath){
     console.log(filePath);
    let fileData =  fs.readFileSync(filePath).toString('hex');
    let result = []
    for (var i = 0; i < fileData.length; i+=2)
      result.push('0x'+fileData[i]+''+fileData[i+1]);
    console.log("done");
    return result;
}

const ResourceService = {
    uploadProductResource:  async (req, res) => {
        const parameters = req.body;
        const file = req.files[0];
        console.log(parameters);
        console.log(file);
        const id = req.params.id;
        try{
            console.log(`${file['path']}`);
            const byteArray = getByteArray(`${file['path']}`);
            const toUpdate = Product.findById(mongoose.Types.ObjectId(id));
            const product  = await toUpdate.lean().exec(); 
            if(!product){
                return res.status(404).send({message: `Product with id ${id} was not found`});
            }
            const filename = `${parameters['name']}.${parameters['extension']}`;

            var params = {
                localFile: `${file['path']}`,

                s3Params:{
                Bucket: "fresh-market-products", 
                Key: filename,
                //Metadata: { "": "value1",}
                }
               };
            var upload = s3.uploadFile(params);
            upload.on('error', function(err) {
                console.error("unable to upload:", err.stack);
              });
            upload.on('end', async function() {
                const imageLink = `https://fresh-market-products.s3.us-east-1.amazonaws.com/${filename}`;
                await toUpdate.update({image: imageLink});
                res.status(201).send({"link": imageLink});
           
             });
            
        } catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    },
    uploadUserResource: async(req, res) => {
        const parameters = req.body;
        const file = req.files[0];
        console.log(parameters);
        console.log(file);
        const id = req.params.id;
        try{
            console.log(`${file['path']}`);
            const byteArray = getByteArray(`${file['path']}`);
            const toUpdate = User.findById(mongoose.Types.ObjectId(id));
            const product  = await toUpdate.lean().exec(); 
            if(!product){
                return res.status(404).send({message: `User with id ${id} was not found`});
            }
            const filename = `${parameters['name']}.${parameters['extension']}`;

            var params = {
                localFile: `${file['path']}`,

                s3Params:{
                Bucket: "fresh-market-users", 
                Key: filename,
                //Metadata: { "": "value1",}
                }
               };
            var upload = s3.uploadFile(params);
            upload.on('error', function(err) {
                console.error("unable to upload:", err.stack);
              });
            upload.on('end', async function() {
                const imageLink = `https://fresh-market-users.s3.us-east-1.amazonaws.com/${filename}`;
                await toUpdate.update({image: imageLink});
                res.status(201).send({"link": imageLink});
           
             });
            
        } catch(error){
            console.log(error);
            res.status(400).send({message: error.message});
        }
    }
}


module.exports = ResourceService; 