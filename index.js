const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

// view engine
app.set('view engine', 'ejs');

// body-parse
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// database

connection.authenticate()
    .then(() => {
        console.log("connection with mysql database is done!");
    }).catch((error) => {
        console.log(error);
    });

// static resource
app.use(express.static('public'));

// routes
app.get("/",(req, res) => {
    //res.send("is working");
    res.render("index");
});

// listen and port config
app.listen(8080, () => {
    console.log("Service is working");
});
