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
            jwt.sign({ id: data.id, phone: data.phoneNum }, keys.secretOrKey, {expiresIn: 36000}, (err, token) => {
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
router.get("/verifi", passport.authenticate("jwt", { session: false }), (req, res) => {
  // 防止用户的密码被返回到客户端
  let user = JSON.parse(JSON.stringify(req.user));
  delete user.password;
  res.jsonp({
    msg: "success",
    user
  });
});

// 修改个人信息前需要验证密码时请求的接口
router.post("/veri_pwd", passport.authenticate("jwt", { session: false }), (req, res) => {
  bcrypt
    .compare(req.body.password, req.user.password)
    .then(function(isMatch) {
      res.jsonp({
        msg: isMatch
      });
    })
    .catch(err => {
      console.log(err.message);
    })
});

// 密码修改接口
router.post("/change_pwd", passport.authenticate("jwt", { session: false }), (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(function(hash) {
      req.user.password = hash;
      res.json(req.user)
      new User(req.user)
        .save()
        .then(data => {
          res.jsonp({
            msg: "success"
          });
        })
        .catch(err => console.log(err.message));
    })
    .catch(err => console.log(err.message));
});

// 用户信息设置及更改接口
// 身份证号(identity)、真实姓名(name)
router.post("/user_info", passport.authenticate("jwt", { session: false }), (req, res) => {
  req.user.identity = req.body.identity;
  req.user.name  = req.body.name;
  new User(req.user)
    .save()
    .then(data => {
      res.jsonp({
        msg: "success"
      });
    })
    .catch(err => console.log(err.message));
});

module.exports = router;