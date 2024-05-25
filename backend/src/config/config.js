const Sequelize = require("sequelize");

const config = {
  username: "root",
  password: "",
  database: "pabw_praktikum",
  host: "localhost",
  dialect: "mysql",
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log
});

module.exports = sequelize;
