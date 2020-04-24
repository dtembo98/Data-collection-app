const User = require("../models/user.model.js");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const services = require("../services/change-phrases-status");
const sequelize = require("../config/database");
var phrases = sequelize.import("../models/eng_phrases.js");
const refreshTokenslist = [];
var numberOfUsers = 0;
const redis = require("redis");
var rediscl = redis.createClient();
rediscl.on("error", (error) => {
  console.log(error);
});

exports.signUp = (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body;
  User.create({
    firstName,
    lastName,
    phoneNumber,
    password: bycrypt.hashSync(password, 8),
  })
    .then(() => {
      return res.status(201).json({
        message: "User was registered successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
};

exports.signIn = async (req, res) => {
  User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }
      console.log(user.password);
      const passwordIsValid = bycrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Invalid Password",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "20m", //86400 24 hours
      });
      const refreshToken = jwt.sign(
        { id: user.id },
        config.refreshTokenSecret,
        {
          expiresIn: 86400,
        }
      );
      //refreshTokenslist.push(refreshToken);
      rediscl.set(
        user.id,
        JSON.stringify({
          refreshToken,
        })
      );

      const userObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        accessToken: token,
        refreshToken,
        phrases: [],
      };
      //req.user = userObj;

      const alreadySent_phrases = await phrases.findAll({
        limit: 5,
        where: { userId: user.id, translated_status: false },
      });
      // send already phrases that have not been yet been translated but been assigned
      if (alreadySent_phrases.length !== 0) {
        userObj.phrases.push(...alreadySent_phrases);

        return res.status(200).json(userObj);
      }
      //fetch phrases that have not yet been assigned to any user

      const results = await phrases.findAll({
        limit: 10,
        where: { sent_status: false, translated_status: false },
      });

      let promise = Promise.resolve();

      results.forEach((phraseObj) => {
        promise = promise.then(() => {
          return phrases.update(
            {
              userId: user.id,
              sent_status: true,
            },
            { where: { Id: phraseObj.Id, sent_status: false } }
          );
        });
      });
      promise
        .then(() => {
          phrases
            .findAll({
              where: { userId: user.id, sent_status: true },
              limit: 10,
            })
            .then((data) => {
              userObj.phrases.push(...data);
              // execute a function for removing  untranslated phrases
              services.changePhraseStatus(user.id);
              return res.status(200).json(userObj);
            });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(404).status({ err: err.message });
    });
};
exports.token = (req, res) => {
  const accessToken = jwt.sign({ id: req.userId }, config.secret, {
    expiresIn: "20m", //86400 24 hours
  });

  return res.status(200).json({ accessToken: accessToken });
};
exports.logOut = (req, res) => {
  rediscl.del(req.userId);
  return res.status(200).json({
    message: "Logout successful",
  });
};
