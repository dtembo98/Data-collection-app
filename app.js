require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const useraAuthRoutes = require("./routes/auth.routes");
const cors = require("cors");
const sequelize = require("./config/database");
const phraseRoutes = require("./routes/eng_phrases.routes");
const helmet = require("helmet");
const compression = require("compression");
const winston = require("winston");
const expressWinston = require("express-winston");
var corOptions = {
  origin: "http://localhost:3000",
};
const sixtyDaysInSeconds = 5184000;
// compression and header security middleware
//app.use(compression());
app.use(
  helmet.hsts({
    maxAge: sixtyDaysInSeconds,
  })
);
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.2.0" }));

app.use(cors(corOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const options = {
  level: "info",
  filename: "./logs/app.log",
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: false,
};
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File(options),
    ],
    meta: false,
    expressFormat: true,
    colorize: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use("/api", useraAuthRoutes);
app.use("/api", phraseRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(port);

    console.log("server is listening on port " + port);
  })
  .catch((err) => {
    console.log(err);
  });
