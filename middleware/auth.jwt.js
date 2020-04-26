const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require("../models/user.model");
const redis = require("redis");
const rediscl = redis.createClient();

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.userId = decoded.id;
    next();
  });
};
verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({
      message: "No token provided!",
    });
  }
  jwt.verify(refreshToken, config.refreshTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "use a valid refresh token or please log in !!!",
      });
    }
    if (decoded.id) {
      let redisToken = rediscl.get(decoded.id);
      console.log(decoded.id);
      if (redisToken.refreshToken === refreshToken) {
        return res.status(400).json({
          message: "Nice Try ;- better luck next time",
        });
      } else {
        req.userId = decoded.id;
      }
    }

    next();
  });
};
const authJwt = {
  verifyToken,
  verifyRefreshToken,
};
module.exports = authJwt;
