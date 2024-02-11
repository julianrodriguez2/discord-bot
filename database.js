const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sqlite:currency.sqlite");

module.exports = sequelize;
