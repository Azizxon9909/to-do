const express = require("express");
const DbUser = require("../model/User");
const bcryptjs = require("bcryptjs");
const passport1 = require('passport')

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Registration",
  });
});

router.post("/register", (req, res) => {
  req.checkBody("email", "email is required").notEmpty();
  req.checkBody("username", "username is required").notEmpty();
  req.checkBody("password", "password is required").notEmpty();
  req.checkBody("confirm", "password is incorrect").equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      title: "Error",
      errors: errors,
    });
  } else {
    const db = new DbUser({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    bcryptjs.genSalt(10, (err, pass) => {
      bcryptjs.hash(db.password, pass, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          db.password = hash;
          db.save()
            .then(() => {
              // req.flash('success', 'Mahsulot yuklandi!')
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    });
  }
});
router.get("/login", (req, res) => {
  res.render("login", {
    title: "LogIn",
  });
});
router.post("/login", (req, res, next) => {
  passport1.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "username or password is incorrect " 
    // successFlash: "Ulandik",
  })(req, res, next);
});
router.get('/logout', (req,res)=>{
  req.logout()
  res.redirect('/')
})

module.exports = router;
