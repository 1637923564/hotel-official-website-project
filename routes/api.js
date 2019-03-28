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

// 品牌信息接口
router.get("/brand", (req, res) => {
  Brand
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 城市信息接口
router.get("/city", (req, res) => {
  City
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 酒店信息接口
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
// 酒店查找接口(根据酒店名)
router.get("/find", (req, res) => {
  Hotel
    .findOne({
      hotelName: req.query.hotelName
    })
    .then(data => {
      data ? res.jsonp({ msg: true, hotel: data })
           : res.jsonp({
             msg: false,
             prompt: "未能找到该酒店"
           });
    })
    .catch(err => {
      console.log(err.message)
      res.status(404).jsonp({
        msg: "数据库加载出错"
      })
    })
});


module.exports = router;