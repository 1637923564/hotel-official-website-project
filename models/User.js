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
  personNum: {
    type: String,
    required: false
  }
});

mongoose.model("user", mongoSchema);