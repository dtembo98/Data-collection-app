const User = require("../models/user.model");

exports.postUser = (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body;
  console.log(req.body);
  User.create({
    firstName,
    lastName,
    phoneNumber,
    password,
  })
    .then((results) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getUsers = (req, res) => {
  User.findAll()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
