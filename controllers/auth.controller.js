const User = require("../models/user.model.js");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const services = require("../services/change-phrases-status");
const sequelize = require("../config/database");
var phrases = sequelize.import("../models/eng_phrases.js");
const refreshTokenslist = [];
var numberOfUsers = 0;
var offset = numberOfUsers * 10;
exports.signUp = (req, res) => {
  //save user to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: bycrypt.hashSync(req.body.password, 8),
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
      refreshTokenslist.push(refreshToken);
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

              return res.status(200).json(userObj);
              //setTimeout(services.changePhraseStatus(userObj.id), 60000);
            });
          // const loggedUser = services.fetchPhrases(req, res);
          // loggedUser
          //   .then((data) => {
          //     return res.status(200).json(data);
          //   })
          //   .catch((err) => {
          //     return res.status(500).json({ message: err.message });
          //   });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(404).status({ err: err.message });
    });
};
exports.token = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      message: "not authorised",
    });
  }
  if (!refreshTokenslist.includes(refreshToken)) {
    return res.status(403).json({ message: "oops" });
  }
  jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const accessToken = jwt.sign({ id: user.id }, config.token, {
      expiresIn: "60m",
    });
    return res.status(200).json({ accessToken: accessToken });
  });
};
exports.logOut = (req, res) => {
  const refreshToken = req.body;
  refreshToken = refreshTokenslist.filter((t) => t == refreshToken);
  refreshTokenslist.splice(refreshTokenslist);
  return res.status(200).json({
    message: "Logout successful",
  });
};
