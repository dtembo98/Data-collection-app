const User = require("../models/user.model.js");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

exports.signUp = (req, res) => {
  //save user to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: bycrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
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

exports.signIn = (req, res) => {
  User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  })
    .then((user) => {
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
        expiresIn: 86400, //24 hours
      });
      return res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: err.message });
    });
};
