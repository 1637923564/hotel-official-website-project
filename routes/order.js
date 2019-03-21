const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const dataTreating = require('../configs/dataTreating');

require("../models/User");
const User = mongoose.model("user");

const router = express.Router();

// 订单添加接口
// { hotel, time, orderTime, bg, address }
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  let orderArr = req.user.order;
  let len = orderArr.length;
  let sign = true;
  orderArr.forEach((item, index) => {
    if(item.hotel === req.body.hotel) {
      sign = false;
      res.jsonp({ msg: "该订单已存在" });
    }else if(index === len - 1 && sign){
      req.user.order.push(req.body);
      new User(req.user)
        .save()
        .then(data => {
          res.jsonp({ msg: "success" });
        })
        .catch(err => {
          console.log(err.message);
          res.status(404).jsonp({ msg: "数据存储失败" });
        });
    }
  });
});

// 订单删除接口
// 通过url传递参数hotel
router.get("/del", passport.authenticate("jwt", { session: false }), (req, res) => {
  let hotels = dataTreating.orderConfig(req.query.hotel, req.user.order);
  if(hotels === -1) {
    res.jsonp({ msg: "订单不存在" });
  }else {
    req.user.order = hotels;
    new User(req.user)
      .save()
      .then(data => {
        res.jsonp({ msg: "success" });
      })
      .catch(err => {
        res.status(404).jsonp("数据存储失败")
      })
  }
});

module.exports = router;