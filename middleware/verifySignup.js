const User = require("../models/user.model");

checkDuplicatePhoneNumber = (req, res, next) => {
  //username
  User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  }).then((user) => {
    if (user) {
      res.status(400).json({
        message: "Failed! phone number is already in use",
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicatePhoneNumber: checkDuplicatePhoneNumber,
};
module.exports = verifySignUp;
