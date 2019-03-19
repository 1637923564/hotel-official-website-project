/**
 * @module API模块
 */
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// 引入数据处理模块
const dataTreating = require("../configs/dataTreating");

// 引入数据模型
require("../models/Brand");
require("../models/City");
require("../models/Hotel");

const Brand = mongoose.model("brand");
const City = mongoose.model("city");
const Hotel = mongoose.model("hotel");

// 获取各品牌数据
router.get("/brand", (req, res) => {
  Brand
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 获取城市数据
router.get("/city", (req, res) => {
  City
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 获取酒店数据
router.post("/hotel", (req, res) => {
  Hotel
    .find({})
    .sort({comment: -1})
    .then(data => {
      let jsData = JSON.parse(JSON.stringify(data))
      if(req.body.brandName) {
        let newData = dataTreating.hotelConfig(req.body.brandName, jsData);
        res.jsonp(newData);
      }else {
        res.jsonp(jsData);
      }
    })
    .catch(e => console.log(e.message));
});


module.exports = router;