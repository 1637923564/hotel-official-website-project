const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

const keys = require("../configs/keys");
require("../models/User");

const User = mongoose.model("user");

// 注册接口
router.post("/register", (req, res) => {
  let registerMsg = req.body;
  User
    .findOne({
      phoneNum: registerMsg.phoneNum
    })
    .then(data => {
      if(data) {
        res.jsonp({
          msg: "该手机号已被注册"
        });
      }else {
        // 对密码进行加密处理
        bcrypt.hash(registerMsg.password, 10, function(err, hash) {
          err ? console.log(err.message)
              : registerMsg.password = hash;

          // 密码加密后的注册信息存入数据库
          new User(registerMsg)
            .save()
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err.message);
            })
        });
      }
    })
    .catch(err => {
      console.log(err.message);
    })
});

// 登录接口
router.post("/login", (req, res) => {
  let loginMsg = req.body;
  User
    .findOne({
      phoneNum: loginMsg.phoneNum
    })
    .then(data => {
      if(!data) {
        res.jsonp({
          msg: "用户名不存在"
        })
      }else {
        // 进行密码验证
        bcrypt.compare(loginMsg.password, data.password, function(err, isMatch) {
          let standard = err ? console.log(err.message)
              : isMatch;
          if(standard) {
            // 生成并返回token
            jwt.sign({ id: data.id, phone: data.phoneNum }, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
              err ? console.log(err.message)
                  : res.jsonp({
                    msg: "匹配成功",
                    token: `Bearer ${token}`
                  });
            });
          }else {
            res.jsonp({msg: "用户名或密码错误"})
          }
        });
      }
    })
    .catch(err => {
      console.log(err.message);
    })
});

// 个人信息接口
router.get("/verifi", passport.authenticate("jwt", {session: false}), (req, res) => {
  console.log(req.user)
})

module.exports = router;