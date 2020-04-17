const Phrases = require("../models/eng_phrases");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
var phrases = sequelize.import("../models/eng_phrases.js");
const translatedPhrases = require("../models/translated_phrases");

exports.fetchPhrases = async (req, res) => {
  const already_sent_phrases = await phrases.findAll({
    where: {
      userId: req.userId,
      translated_status: false,
    },
    limit: 5,
  });
  if (already_sent_phrases.length !== 0) {
    return res.status(200).json({ phrases: [...already_sent_phrases] });
  } else {
    const results = await phrases.findAll({
      limit: 10,
      where: { sent_status: false, translated_status: false },
    });

    let promise = Promise.resolve();

    results.forEach((phraseObj) => {
      promise = promise.then(() => {
        return phrases.update(
          {
            userId: req.userId,
            sent_status: true,
          },
          { where: { Id: phraseObj.Id, sent_status: false } }
        );
      });
    });
    promise.then(() => {
      phrases
        .findAll({
          where: { userId: req.userId, sent_status: true },
          limit: 10,
        })
        .then((data) => {
          return res.status(200).json({ phrases: [...data] });
          //setTimeout(services.changePhraseStatus(userObj.id), 60000);
        });
    });
  }
};
exports.postTranslatedPhrases = async (req, res) => {
  const { phraseId, tonga } = req.body;
  if (phraseId && tonga) {
    const phrase = await translatedPhrases.findAll({
      where: { phraseId: phraseId },
    });
    console.log(JSON.stringify(phrase));
    if (phrase.length == 0) {
      translatedPhrases
        .create({
          userId: req.userId,
          phraseId: phraseId,
          tonga: tonga,
        })
        .then((data) => {
          if (data) {
            return res.status(201).json({
              message: "phrase translated",
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    } else {
      return res.status(400).json({ message: "phrase already translated" });
    }
  } else {
    return res
      .status(400)
      .json({ message: "please send the phraseId and tonga phrase" });
  }
};
exports.fetchAllPhrases = (req, res) => {
  phrases
    .findAll()
    .then((results) => {
      //console.log(results);
      return res.status(200).json(results);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
