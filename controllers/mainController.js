const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getIndex = (req, res) => {
  res.render('index', {
    title: 'Homepage',
  });
};

exports.getAccount = (req, res) => {
  res.render("account", {
    title: "Account",
  });
};
