const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const useraAuthRoutes = require("./routes/auth.routes");
const cors = require("cors");
const sequelize = require("./config/database");
const phraseRoutes = require("./routes/eng_phrases.routes");
const helmet = require("helmet");

var corOptions = {
  origin: "http://localhost:3000",
};
const sixtyDaysInSeconds = 5184000;
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
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use("/api", useraAuthRoutes);
app.use("/api", phraseRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(port);

    console.log("listening on port " + port);
  })
  .catch((err) => {
    console.log(err);
  });
