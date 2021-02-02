const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    required: true,
  },
  control: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("todo", TodoSchema);
