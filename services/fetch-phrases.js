const sequelize = require("../config/database");
//const SentPhrases = require("../models/sent-phrases.model");

exports.fetchPhrases = async (req, res) => {
  var phrases = sequelize.import("../models/eng_phrases.js");
  const results = await phrases.findAll({ phraseStatus: 0, limit: 30 });
  let promise = Promise.resolve();
  const updatedPhrasesList = [];
  results.forEach((phraseObj) => {
    promise = promise.then(() => {
      return phrases.update(
        {
          userId: req.user.id,
          phraseStatus: 1,
        },
        { where: { Id: phraseObj.Id, phraseStatus: 0 } }
      );
    });
  });
  promise.then(() => {
    phrases
      .findAll({
        where: { userId: req.user.id, phraseStatus: 1 },
        limit: 20,
      })
      .then((data) => {
        req.user.phrases.push(...data);
        return req.user;
      });
  });
  // results.forEach(async (phraseObj) => {
  //   await phrases.update(
  //     {
  //       userId: req.user.id,
  //       phraseStatus: 1,
  //     },
  //     { where: { Id: phraseObj.Id, phraseStatus: 0 } }
  //   );
  // });
  // const promise = await phrases.findAll({
  //   where: { userId: req.user.id, phraseStatus: 1 },
  //   limit: 20,
  // });
  // const updatedPhrases = Promise.all(promise);

  // req.user.phrases.push(...updatedPhrases);
  // return req.user;
};
