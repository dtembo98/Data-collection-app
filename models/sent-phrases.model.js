const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const SentPhrases = sequelize.define("sent_phrase", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  phrase: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = SentPhrases;
