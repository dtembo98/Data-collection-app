const services = require("../services/change-phrases-status");
const sequelize = require("../config/database");
var phrases = sequelize.import("../models/eng_phrases.js");
const translatedPhrases = require("../models/translated_phrases");
const redis = require("redis");
var rediscl = redis.createClient();
exports.fetchPhrases = async (req, res) => {
  // Retrieve phrases that have already been assigned to user
  const already_sent_phrases = await phrases.findAll({
    where: {
      userId: req.userId,
      translated_status: false,
    },
    limit: 5,
  });
  // send phrases to the user if phrases exists
  if (already_sent_phrases.length !== 0) {
    return res.status(200).json({ phrases: [...already_sent_phrases] });
  }
  // if phrases do not exist  for that user then assign new phrases to the user
  else {
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
          services.changePhraseStatus(req.userId);
          return res.status(200).json({ phrases: [...data] });
        });
    });
  }
};
exports.postTranslatedPhrases = async (req, res) => {
  const { phraseId, tonga } = req.body;

  if (phraseId && tonga) {
    // prevent user from translating phrases that have not been assigned to them
    const rightUser = await phrases.findOne({
      where: {
        Id: phraseId,
        userId: req.userId,
      },
    });
    //check if phrase is already translated
    const phrase = await translatedPhrases.findOne({
      where: { phraseId: phraseId },
    });

    // check if phrase does not exist exist create one if exist display error message
    // check if its the right user
    if (!phrase) {
      //prevent user from translating phrase that was not assigned to them
      if (rightUser) {
        await translatedPhrases
          .create({
            userId: req.userId,
            phraseId: phraseId,
            tonga: tonga,
          })
          .then(() => {
            //after successfully creating a translated phrase
            //update the eng_phrases table
            phrases.update(
              {
                translated_status: true,
              },
              { where: { Id: phraseId, translated_status: false } }
            );

            return res.status(201).json({
              message: "phrase translated",
            });
          })
          .catch((err) => {
            return res.status(500).json({ message: err.message });
          });
      }
      // display error message to users who attempts to tranlate phrases not assigned to them
      else {
        return res.status(400).json({
          message: "phrase was not assigned to user ",
        });
      }
    }
    //if phrase already exist respond with the message
    else {
      return res.status(400).json({ message: "phrase already translated " });
    }
  }
  // when the phraseId or tonga phrase is are not provided respond with the error message
  else {
    return res
      .status(400)
      .json({ message: "please send the phraseId and tonga phrase " });
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
