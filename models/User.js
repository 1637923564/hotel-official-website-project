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
  identity: String,
  name: String,
  order: {
    type: Array,
    default: []
  }
});

mongoose.model("user", mongoSchema);