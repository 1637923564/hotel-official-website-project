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
styleTool.preventDisplayNone(".p-head .icon-phone", ".p-head .phone-number");
styleTool.preventDisplayNone(".p-head .icon-contextphone", ".p-head .qr-code");
styleTool.defaultVal("#from-date", ".home");
styleTool.defaultVal("#to-date", ".home");
styleTool.defaultFormData({
  cityInput: ".cities",
  fromInput: "#from-date",
  toInput: "#to-date",
  keyInput: ".keyword",
  page: ".search"
});
styleTool.saveLocalstorage(".save-form", ".to-save");
styleTool.carousel({
  tar: ".home .carousel .img-list",
  runTime: 400,
  interval: 5000,
  fps: 60,
  btnWrap: ".home .carousel .btn"
});
styleTool.dateSelect(".search-wrap #from-date", ".search-wrap #to-date", ".search-wrap .cities");
styleTool.brandSwiper(Swiper);

dataTool.brandDataLoader({
  page: "body>.list",
  swiperSlide: ".select-list .swiper-slide>a",
  pageBg: ".ally-select>img",
  introWrap: ".ally-intro",
  showMap: styleTool.showMap
});
dataTool.cityLoader(".search-wrap .cities", ".search-wrap .city-menu", styleTool.dropDownMenu);
dataTool.promptFacility(".search-wrap .cities", ".search-wrap .city-menu", styleTool.dropDownMenu);
dataTool.searchCities({
  page: "body>.search",
  searchBtn: ".to-save",
  form: ".save-form"
});