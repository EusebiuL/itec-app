require("dotenv").config();
const router = require("express").Router();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const passport = require("passport");

const cors = require('cors');

app.options('*', cors())
app.use(cors());


app.use(bodyParser.json());

router.use(require(__dirname + "/controllers/UserController"));

app.use('/api/v1', router);

module.exports = app;