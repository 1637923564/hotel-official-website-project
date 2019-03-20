const mongoose = require("mongoose");

const mongoSchema = mongoose.Schema({
  phoneNum: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  identity: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  }
});

mongoose.model("user", mongoSchema);