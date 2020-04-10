const Sequelize = require("sequelize");

const sequelize = new Sequelize("blackhat", "root", "pass104", {
  dialect: "mysql",
  host: "localhost",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
module.exports = sequelize;
