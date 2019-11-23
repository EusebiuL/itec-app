var s3 = require('s3-client');
 
var client = s3.createClient({
  maxAsyncS3: 20,     
  s3RetryCount: 3,    
  s3RetryDelay: 1000, 
  multipartUploadThreshold: 20971520, 
  multipartUploadSize: 15728640, 
  s3Options: {
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: "us-east-1",
  },
});

module.exports = client;