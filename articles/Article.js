const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },

    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});


// User.hasMany(Post, {foreignKey: 'user_id'})
// Post.belongsTo(User, {foreignKey: 'user_id'})

// Post.find({ where: { ...}, include: [User]})

Category.hasMany(Article, {foreignKey: 'categoryId'});      // uma categoria tem muitos artigos

                                // um artigo pertece a uma categoria
Article.belongsTo(Category, {foreignKey: 'categoryId'});    // relacionamento de artigo com categoria

// Article.sync({force: true});

module.exports = Article;