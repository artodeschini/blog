const Sequelize = require('sequelize');

const connection = new Sequelize('griapress', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;