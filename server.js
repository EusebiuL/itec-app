const express = require('express');
const app = require(__dirname + "/app.js");
const bodyParser = require('body-parser');
const PORT = (process.argv.length === 3 && Number.parseInt(process.argv[2])) || 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');

mongoose.Promise = global.Promise;

mongoose.connect(config.DB, { useNewUrlParser: true, useCreateIndex: true, }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});

app.use(async (req, res) => {
  res.status(404).json({ message: 'Invalid route' });
})