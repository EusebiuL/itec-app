var s3 = require('s3-client');
 
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: "AKIAV3ERDBSLPE5ONUI3",
    secretAccessKey: "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",
    region: "us-east-1",
  },
});

module.exports = cllient;