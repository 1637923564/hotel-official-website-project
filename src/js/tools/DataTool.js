/**
 * 后台数据加载及处理
 * @module DataTool
 * @param {JQueryStatic} $ 
 */
function DataTool($) {
  // #region 实现 省略new关键字也能实例化对象
  if (!this) {
    return new StyleTool($)
  }
  // #endregion
  /**
   * list界面brand(品牌)数据加载
   * @method brandDataLoader
   * @param {Object} params 参数集合
   * @param {String} params.page 用以判断是否在某一界面
   * @param {String} params.swiperSlide 需要触发页面变化的按钮
   * @param {String} params.pageBg 背景图节点
   * @param {String} params.introWrap 介绍模块的背景图
   * @param {Function} params.showMap StyleTool模块的showMap方法
   */
  this.brandDataLoader = function(params) {
    if($(params.page).length > 0) {
      let that = this;
      $.ajax({
        type: "GET",
        url: "/api/brand",
        success: function(data) {
          let $swiperSlide = $(params.swiperSlide);
          $swiperSlide.on("click", function(e) {
            // 防止点击a标签界面跳转
            e.preventDefault();
            let $clickSwiperSlide = $(this)
            // 获取所选中的品牌
            let brandName = $clickSwiperSlide.attr("brandName");
            // 调用本模块的hotelLoader方法
            that.hotelLoader({
              brandName: brandName,
              showMap: params.showMap
            });
            // 点击按钮实现变化
            $clickSwiperSlide.parent(".swiper-slide").siblings(".swiper-slide").children("a").removeClass("click-style");
            $clickSwiperSlide.addClass("click-style");
            var selectedBrand = {};
            for(let i = 0, len = data.length; i < len; i ++) {
              if(data[i].brandName === brandName) {
                selectedBrand = data[i];
              }
            }
            // 将该品牌数据写入界面
            $(params.pageBg).attr("src", selectedBrand.bg);
            $(params.introWrap).children("h2").text(selectedBrand.brandName);
            $(params.introWrap).children("div").text(selectedBrand.perSign);
            $(params.introWrap).children("p").text(selectedBrand.intro);
            $(params.introWrap).css({
              "background": `url(${selectedBrand.introBg}) no-repeat 0`,
              "backgroundColor": "whitesmoke",
              "backgroundSize": "50% 100%"
            });
          });

          // 默认给第一个元素一个点击事件
          $swiperSlide[0].click();
        }
      });
    }
  }
  /**
   * 酒店数据可视化实现
   * @method hotelLoader
   * @param {Object} 数据集合
   * @param {String} params.brandName 品牌
   * @param {Function} params.showMap StyleTool模块的showMap方法
   */
  this.hotelLoader = function(params) {
    $.ajax({
      type: "POST",
      url: "/api/hotel",
      data: {brandName: params.brandName},
      success: function(data) {
        let elStr = "";
        let dataObj = {};
        let facilitiesStr = "";
        if(data.length === 0) {
          elStr = "暂无酒店"
        }else {
          for(let i = 0, len = data.length;i < len; i ++) {
            dataObj = data[i];
            facilitiesStr = "";
            for(let j = 0, len2 = dataObj.facilities.length; j < len2; j ++) {
              switch (dataObj.facilities[j]) {
                case "wifi":
                  facilitiesStr += `<span class="iconfont icon-wifi"></span>`
                  break;
                case "停车场":
                  facilitiesStr += `<span class="iconfont icon-tingchechang"></span>`
                  break;
                case "游泳池":
                  facilitiesStr += `<span class="iconfont icon-youyongchi"></span>`
                  break;
                case "热水":
                  facilitiesStr += `<span class="iconfont icon-reshuiqi"></span>`
                  break;
                case "自行车租赁":
                  facilitiesStr += `<span class="iconfont icon-zixingche"></span>`
                  break;
                case "送餐服务":
                  facilitiesStr += `<span class="iconfont icon-songcan"></span>`
                  break;
                case "儿童乐园":
                  facilitiesStr += `<span class="iconfont icon-ertongleyuan
                  "></span>`
                  break;
                case "饮料":
                  facilitiesStr += `<span class="iconfont icon-yinliao"></span>`
                  break;
                case "商务中心":
                  facilitiesStr += `<span class="iconfont icon-shangwuzhongxinr"></span>`
                  break;
                case "行政酒廊":
                  facilitiesStr += `<span class="iconfont icon-xingzhengjiulang"></span>`
                  break;
                case "外币兑换":
                  facilitiesStr += `<span class="iconfont icon-icon-test-copy"></span>`
                  break;
                case "婴儿看护":
                  facilitiesStr += `<span class="iconfont icon-yinger"></span>`
                  break;
              }
            }
            elStr += `
              <li>
                <a href="javaScript:">
                  <img class="showMapClick" src="${dataObj.hotelBg}" address="${dataObj.address}" tit="${dataObj.hotelName}">
                </a>
                <div class="basic-infor">
                  <div class="title">${dataObj.hotelName}</div>
                  <div class="quality">
                    <span>${dataObj.startTime}&nbsp;</span>
                    <span>${dataObj.type}</span>
                  </div>
                  <div class="address">${dataObj.address}</div>
                  <!-- 图标 -->
                  <div class="facility">
                    ${facilitiesStr}
                  </div>
                </div>
                <div class="btn-wrap">
                  <div class="remark">
                    <b>${dataObj.comment}条评论</b>
                    <span>${dataObj.grade}</span>
                  </div>
                  <a href="#" class="btn">立即预定</a>
                </div>
              </li>
            `
          }
        }
        $(".list .hotel-list>.hotel").html(elStr)
        params.showMap(".showMapClick")
      }
    })
  }
  this.cityLoader = function(cityInput, cityMenu, dropDownMenu) {
    if($(cityInput).length) {
      $.ajax({
        type: "GET",
        url: "/api/city",
        success: function(data) {
          let elStr = "<div>所有城市</div>";
          for(let i = 0, len = data.length; i < len; i ++) {
            elStr += `
            <span>${data[i].cname}</span>
            `
          }
          $(cityMenu).html(elStr);
          dropDownMenu(cityInput, cityMenu);
        }
      })
    }
  }
}
export default DataTool;