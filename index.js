const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const todo = require("./routers/todo");
const passport = require("passport");
const rUser = require("./routers/user");
const expressValidator = require("express-validator");
const session = require("express-session");
const morgan = require("morgan");
const config = require('./config');

app.use(morgan("dev"));

// Connect Flash

app.use(require("connect-flash")());

// Setting express validator
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// express-session

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split(".");
      root = namespace.shift();
      formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

mongoose
  .connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDBga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.error("MongoDBga ulanish vaqtida xato ro'y berdi...", err);
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
require("./md/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
const def = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Please log in!");
    res.redirect("/login");
  }
};
app.use(rUser);
app.use(def);
app.use(todo);
let port = process.env.PORT || '3000';
app.listen(port, () => {
  console.log(`server http://localhost:${port}/ portda ishladi`);
});
