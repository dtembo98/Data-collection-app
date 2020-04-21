const sequelize = require("../config/database");
var cron = require("node-cron");
var phrases = sequelize.import("../models/eng_phrases.js");
// change traslation status for users that have not translated phrases for within the specified time
// remove user id  from phrases that were assigned but not have not been translated
exports.changePhraseStatus = async (userId) => {
  setInterval(() => {
    phrases.update(
      {
        userId: null,
        sent_status: false,
      },
      { where: { userId: userId, translated_status: false } }
    );
  }, 600000);
};
