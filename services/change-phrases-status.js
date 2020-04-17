const sequelize = require("../config/database");
//const SentPhrases = require("../models/sent-phrases.model");
// fucntion to remove untranslated phrases
exports.changePhraseStatus = (userId) => {
  var phrases = sequelize.import("../models/eng_phrases.js");
  phrases
    .findAll({
      userId: userId,
      translated_status: false,
    })
    .then((results) => {
      console.log(results);
      results.forEach((phraseObj) => {
        phrases.update(
          {
            userId: null,
            sent_status: false,
          },
          { where: { Id: phraseObj.Id } }
        );
      });
    });
};
