const Phrases = require("../models/eng_phrases");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");

exports.fetchPhrases = (req, res) => {
  var phrases = sequelize.import("../models/eng_phrases.js");
  sequelize.sync({ force: false }).then(() => {
    phrases
      .findAll()
      .then((results) => {
        //console.log(results);
        return res.status(200).json(results);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};
