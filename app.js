const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const dataTreating = require("./configs/dataTreating");

// 引入数据模型
require("./models/Brand");
require("./models/City");
require("./models/Hotel");

const app = express();

// 托管静态目录
app.use(express.static("dist"));
app.use(express.static("dist/views"));
app.use(express.static("dist/views/partials"));

// 解析客户端发送post请求传递的body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 连接MongoDB
mongoose
  .connect("mongodb://localhost/hotel-office-website-demo")
  .then(() => console.log("数据库连接成功..."))
  .catch(e => console.log(e.name + ": " + e.message));
const Brand = mongoose.model("brand");
const City = mongoose.model("city");
const Hotel = mongoose.model("hotel");
// 获取各品牌数据
app.get("/api/brand", (req, res) => {
  Brand
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 获取城市数据
app.get("/api/city", (req, res) => {
  City
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
});
// 获取酒店数据
app.post("/api/hotel", (req, res) => {
  Hotel
    .find({})
    .then(data => {
      let jsData = JSON.parse(JSON.stringify(data))
      let newData = dataTreating.hotelConfig(req.body.brandName, jsData);
      res.jsonp(newData);
    })
    .catch(e => console.log(e.message));
});

app.listen(8000, () => console.log("http://localhost:8000"));