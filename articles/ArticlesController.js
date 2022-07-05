const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Category = require("../categories/Category");
const Article = require("./Article");

router.get("/admin/articles", (req, res) => {

    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            let mapCategories = new Map(
                categories.map(object => {
                  return [object.id, object];
                })
            );
            // console.log(mapCategories);
            // console.log(articles);

            res.render("admin/articles/index", {
                articles: articles,
                categories: mapCategories
        });    

        // include: [{
        //     model: Category,
        //     required: true,
        //     right: true//,
        //     // as: 'category'
        //   }]
        // include: {model: Category} 
        //     where: {
        //       cityName: "York",
        //     },
        //   },

        // console.log(articles);

        // res.render("admin/articles/index", {
        //     articles: articles,
        //     categories: mapCategories
        });
    });
    
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    });
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

// router.delete('/categories/:id', (req, res) => {
router.post('/articles/delete', (req, res) => {
    let id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) { // verifica se é um numero numero
            Article.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/admin/articles");
            }); 
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/articles");
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {
                    categories: categories,
                    article: article
                });
            });
            // res.render("admin/articles/edit", {article: article});
        } else {
            res.redirect("/admin/articles");
        }
    });
});

router.post("/admin/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let category = req.body.category;
    let body = req.body.body;

    Article.update(
        {title: title, slug: slugify(title), categoryId: category, body: body },
        {where: { id:id }}
    ).then(() => {
        res.redirect("/admin/articles");
    })
});

router.get("/articles/page/:num", (req, res) => {
    const itens = 4;
    let page = req.params.num;
    var offset;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * itens;
    }

    Article.findAndCountAll({
        limit: itens,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        
        let next = true;

        if (offset + itens >= articles.count) {
            next = false;
        }
        
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("index", {result: result, categories: categories});
        });

        res.json(result);
    })

});

module.exports = router;