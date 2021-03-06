const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const port = 8080;

// controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

// models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// view engine
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// session
// sugesto usar redis ao inves da memoria 
// app.use(session({
//     secret: "UmaChaveQualquer", cookie: {
//         maxAge: 3600000 //tempo de duracao da session tempo em milisegundos

//     }
// }));
app.use(session({ 
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
    maxAge: 3600000 //tempo de duracao da session tempo em milisegundos
 }));

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

// // teste de session
// app.get("/session", (req, res) => {
//     req.session.treinamento = "teste";
//     req.session.ano = new Date().getFullYear();
//     req.session.email = "artodeschini@yahoo.com.br";
//     req.session.user = {
//         username: 'artodeschini',
//         email: 'artodeschini@yahoo.com.br',
//         id: 69
        
//     }

//     res.send("session enviada")
// });

// // teste de session
// app.get("/check-session", (req, res) => {
//     res.json({
//         treinamento: req.session.treinamento,
//         ano: req.session.ano,
//         email: req.session.email,
//         user: req.session.user
//     })
// });


// routes
app.get("/",(req, res) => {
    Article.findAll(
        { order: [
            ['id', 'DESC']
         ],
         limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug",(req, res) => {
    let slug = req.params.slug;
    Article.findOne({where: {slug: slug}}).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        } else {
            res.redirect("/");
        }  
    }).catch( error => {
        console.log(error);
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne(
        {where: {slug: slug}
    }).then(category => {
        if (category != undefined) {
            // Category.findAll(categories => {
            //     res.render("article", {article: article, categories: categories});
            // });
            Article.findAll({
                order: [['id', 'DESC']],
                where: {categoryId: category.id}
            }).then(articles => {
                Category.findAll().then(categories => {
                    res.render("index", {articles: articles, categories: categories});
                });
            });
        }
        res.redirect("/");  
    }).catch( error => {
        console.log(error);
        res.redirect("/");
    });
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// listen and port config
app.listen(port, () => {
    console.log("Service is working");
});
