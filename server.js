"use strict";
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const keys = require("./src/config/keys")

//Models
const User = require("./models/user");
const FoodEntry = require("./models/foodEntry");

//Controllers
const userController = require("./controllers/UserController");
const foodController = require("./controllers/FoodController");

const app = express();
const router = express.Router();

//mLab
const mongoDB = keys.mongoDB;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

/* ROUTES */

//Initialize the API
router.get("/", function(req, res) {
  res.json({ message: "API Initialized!" });
});

//user routes
router
  .route("/users")
  .get(userController.userGet)
  .post(userController.userSignUp);

router.route("/userLogin").post(userController.userLogin);

router
  .route("/foodEntry")
  .get(foodController.entryGet)
  .post(foodController.newEntry)
  .delete(foodController.deleteEntry);

router.route("/userFoodEntries").post(foodController.allUserEntries);

app.use("/api", router);
app.listen(port, function() {
  console.log("api running on port " + port);
});
