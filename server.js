const express = require('express');
const app = require(__dirname + "/app.js");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');

mongoose.Promise = global.Promise;
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});

app.use(async (req, res) => {
  res.status(404).json({ message: 'Invalid route' });
})