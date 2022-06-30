const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

// controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

// models
const Article = require("./articles/Article");
const Category = require("./categories/Category");

// view engine
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

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

app.use("/", categoriesController);
app.use("/", articlesController);

// listen and port config
app.listen(8080, () => {
    console.log("Service is working");
});
