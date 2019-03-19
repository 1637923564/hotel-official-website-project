const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const apiRouter = require("./routes/api"); //引入router

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

// 使用router中间件
app.use("/api", apiRouter);

app.listen(55558, () => console.log("http://localhost:55558"));