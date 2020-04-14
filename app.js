const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const useraAuthRoutes = require("./routes/auth.routes");
const cors = require("cors");
const sequelize = require("./config/database");
const phraseRoutes = require("./routes/eng_phrases.routes");

var corOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api",
  (req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  },
  useraAuthRoutes
);
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
