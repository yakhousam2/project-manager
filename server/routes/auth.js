const route = require("express").Router();
const passport = require("passport");
const User = require("../models/user");

const isLogedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};

route.get("/auth", isLogedIn, (req, res) => {
  res.locals.error = req.flash("error");
  res.locals.passwordError = req.flash("passwordError");
  res.locals.usernameError = req.flash("usernameError");
  res.render("auth");
});

// Login
route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth",
    successRedirect: "/",
    failureFlash: true
  })
);
/******************* */

//Register
route.post(
  "/register",
  (req, res, next) => {
    console.log("body =", req.body.username);
    User.findOne({ username: req.body.username }, (err, user) => {
      console.error(err);
      if (err) return next(err);
      if (user) {
        req.flash("usernameError", "Username already used");
        return res.redirect("/auth");
      }
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(function(err) {
        console.log("new user");
        if (err) {
          const usernameError = err.errors.username.message || "";
          const passwordError = err.errors.password.message || "";
          console.log(err.errors);
          req.flash("passwordError", passwordError);
          req.flash("usernameError", usernameError);
          res.redirect("/auth");
        } else {
          next();
        }
      });
    });
  },
  passport.authenticate("local", {
    failureRedirect: "/auth",
    successRedirect: "/",
    failureFlash: true
  })
);
/*************************** */

// Logout
route.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth");
});

module.exports = route;
