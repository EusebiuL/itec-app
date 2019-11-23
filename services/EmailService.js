const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'freshmarket.itec@gmail.com',
      pass: 'freshmarket1.'
    },
    tls: {
      rejectUnauthorized: false
    }
  }));


  module.exports = transporter;