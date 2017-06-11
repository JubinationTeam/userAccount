'use strict'

// node dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// user-defined dependencies
var initFunction=require('./init.js').init;

// json parsing
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);

// port settings
var port = process.env.PORT||443;
app.listen(port,init)

// initialiser function
function init(){
    console.log("Server is listening");
    initFunction(); 
    //controller call
    require('jubi-express-controller').process(app);
 
};


