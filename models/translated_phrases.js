const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const translated_phrases = sequelize.define("translated_phrases", {
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
  phraseId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tonga: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = translated_phrases;
