import $ from "jquery";
import Swiper from "../lib/swiper/swiper";
import LoadTool from "./tools/LoadTool";
import StyleTool from "./tools/StyleTool";
import DataTool from "./tools/DataTool";

import "amazeui";
import "amazeui/dist/css/amazeui.css";
import "../assets/style.scss";
import "../assets/publicStyle.scss";
import "../lib/icon/iconfont.css";
import "../lib/icon/iconfont";
import "../lib/jQuery-UI/jquery-ui";
import "../lib/swiper/swiper.css";

let loadTool = new LoadTool($);
let styleTool = new StyleTool($);
let dataTool = new DataTool($);

loadTool.loader(".p-head", ".p-foot");
styleTool.rollingTrigger("body>.home");
styleTool.preventDisplyNone(".p-head .icon-phone", ".p-head .phone-number");
styleTool.preventDisplyNone(".p-head .icon-contextphone", ".p-head .qr-code");
styleTool.carousel({
  tar: ".home .carousel .img-list",
  runTime: 400,
  interval: 5000,
  fps: 60,
  btnWrap: ".home .carousel .btn"
});
styleTool.dateSelect(".search-wrap #from-date", ".search-wrap #to-date");
styleTool.brandSwiper(Swiper);

dataTool.brandDataLoader({
  page: "body>.list",
  swiperSlide: ".select-list .swiper-slide>a",
  pageBg: ".ally-select>img",
  introWrap: ".ally-intro",
  showMap: styleTool.showMap
});
dataTool.cityLoader(".search-wrap .cities", ".search-wrap .city-menu", styleTool.dropDownMenu);


$(".my-form input").on("click", function(e) {
  console.log($(".my-form").serializeArray());
})

