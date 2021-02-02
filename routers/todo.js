const express = require("express");
const TodoSchema = require("../model/Todo");
const router = express.Router();

router.get("/", (req, res) => {
  TodoSchema.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Bosh sahifa",
        datas: data,
      });
    }
  });
});

router.post("/", (req, res) => {
  let db = new TodoSchema({
    title: req.body.title,
    dateTime: req.body.dateTime,
    owner: req.body.owner,
    control: req.body.control,
  });
  db.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
router.get("/up/update/:id", (req, res) => {
  TodoSchema.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
router.post("/up/update/:id", (req, res) => {
  TodoSchema.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});

router.get("/remove/:id", (req, res) => {
  TodoSchema.deleteOne({ _id: req.params.id }, (err) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});

module.exports = router;
