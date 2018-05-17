const bcrypt = require("bcrypt");
const User = require("../models/user.js");

exports.userSignUp = function(req, res) {
  User.findOne({ userName: req.body.userName }, function(err, user) {
    if (user === null) {
      let user = new User();
      user.userName = req.body.userName;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.name = req.body.name;
      user.weight = req.body.weight;
      user.height = { feet: req.body.feet, inches: req.body.inches };

      user.optimalCalorieIntake = req.body.weight * 13;

      user.memberSince = new Date();
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: "User successfully added!" });
      });
    } else {
      res.send({ userExists: true });
    }
  });
};

exports.userLogin = function(req, res) {
  User.findOne({ userName: req.body.userName }, function(err, user) {
    let loginFail = { message: "Login Fail" };
    if (user === null) {
      res.send(loginFail);
    } else if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json(user);
    } else {
      res.send(loginFail);
    }
  });
};
