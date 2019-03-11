const express = require("express");
const mongoose = require("mongoose");

require("./models/Brand");

const app = express();

// 托管静态目录
app.use(express.static("dist"));
app.use(express.static("dist/views"));
app.use(express.static("dist/views/partials"));
// 连接MongoDB
mongoose
  .connect("mongodb://localhost/hotel-office-website-demo")
  .then(() => console.log("数据库连接成功..."))
  .catch(e => console.log(e.name + ": " + e.message));
const Brand = mongoose.model("brand");
// 向/api/brand发送请求将返回brand的api数据
app.get("/api/brand", (req, res) => {
  Brand
    .find({})
    .then(data => {
      res.jsonp(data);
    })
    .catch(e => console.log(e.message));
})

app.listen(8000, () => console.log("http://localhost:8000"))