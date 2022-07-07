const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {
            users: users
        });
    });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.get("/admin/users/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        res.redirect("/admin/users");
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/users/edit", {
                user: user
            });
        } else {
            res.redirect("/admin/users");
        }
    });
});

router.post("/admin/users/create", adminAuth, (req, res) => {
    let email = req.body.email.trim();
    let password = req.body.password;

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user == undefined) {

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                console.log(err);
                res.redirect("/admin/users");
            })

        } else {
            res.render("admin/users/create");
        }
    });
    // res.json({email, password});
});

router.post('/admin/users/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) { // verifica se é um numero numero
            User.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/admin/users");
            }); 
        } else {
            res.redirect("/admin/users");
        }
    } else {
        res.redirect("/admin/users");
    }
});

router.get("/admin/login", (req, res) => {
    // console.log("achei a rota");
    // res.send("achei");
    res.render("admin/users/login")
});


router.post("/admin/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // console.log('achei');

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user == undefined) {
            res.redirect("/admin/login");
        } else {
               
            //validar senha
            let correct = bcrypt.compareSync(password, user.password)
            
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.json(req.session.user);
            }else {
                res.redirect("/admin/login");
            }
        }
    });
});

router.get("/admin/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;