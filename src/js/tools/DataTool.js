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
  this.brandDataLoader = function (params) {
    if ($(params.page).length > 0) {
      let that = this;
      $.ajax({
        type: "GET",
        url: "/api/brand",
        success: function (data) {
          let $swiperSlide = $(params.swiperSlide);
          $swiperSlide.on("click", function (e) {
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
            for (let i = 0, len = data.length; i < len; i++) {
              if (data[i].brandName === brandName) {
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
  this.hotelLoader = function (params) {
    if(params.data) {
      let data = params.data;
      let elStr = "";
      let dataObj = {};
      let facilitiesStr = "";
      if (data.length === 0) {
        elStr = "暂无酒店"
      } else {
        for (let i = 0, len = data.length; i < len; i++) {
          dataObj = data[i];
          facilitiesStr = "";
          for (let j = 0, len2 = dataObj.facilities.length; j < len2; j++) {
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
      $(".search .hotel-list>.hotel").html(elStr)
      setTimeout(() => {
        params.showMap(".showMapClick");
      });
    }else {
      $.ajax({
        type: "POST",
        url: "/api/hotel",
        data: {
          brandName: params.brandName
        },
        success: function (data) {
          let elStr = "";
          let dataObj = {};
          let facilitiesStr = "";
          if (data.length === 0) {
            elStr = "暂无酒店"
          } else {
            for (let i = 0, len = data.length; i < len; i++) {
              dataObj = data[i];
              facilitiesStr = "";
              for (let j = 0, len2 = dataObj.facilities.length; j < len2; j++) {
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
          setTimeout(() => {
            params.showMap(".showMapClick")
          });
        }
      })
    }
  }
  /**
   * 城市数据可视化实现
   * @method cityLoader
   * @param {String} cityInput 输入框
   * @param {String} cityMenu 城市下拉菜单
   * @param {Function} dropDownMenu StyleTool模块的dropDownMenu
   * @param {String} textInInput 实现下拉菜单提示时使用的参数（输入框中的文本）
   */
  this.cityLoader = function (cityInput, cityMenu, dropDownMenu, textInInput) {
    if ($(cityInput).length) {
      $.ajax({
        type: "GET",
        url: "/api/city",
        success: function (data) {
          let arr = [];
          if (typeof (textInInput) !== "undefined") {
            let reg = new RegExp(textInInput, "i");
            for (var i = 0, len = data.length; i < len; i++) {
              let str = data[i].cname + "市" + data[i].name + "shi";
              if (str.match(reg)) {
                arr.push(data[i]);
              }
            }
          }
          let menuData = arr.length > 0 ?
            arr :
            data;
          let headTxt = arr.length > 0 ?
            "为您找到了以下城市" :
            "所有城市";
          let elStr = "<div>" + headTxt + "</div>";
          for (var i = 0, len = menuData.length; i < len; i++) {
            elStr += `
            <span>${menuData[i].cname}</span>
            `
          }
          $(cityMenu).html(elStr);
          dropDownMenu(cityInput, cityMenu);
        }
      })
    }
  }
  /**
   * 下拉菜单提示功能
   * @method promptFacility
   * @param {String} cityInput 输入框
   * @param {String} cityMenu 城市下拉菜单
   * @param {Function} dropDownMenu StyleTool模块的dropDownMenu
   */
  this.promptFacility = function (cityInput, cityMenu, dropDownMenu) {
    let that = this;
    let $cityInput = $(cityInput);
    if ($cityInput.length > 0) {
      $cityInput[0].oninput = function (e) {
        let textInInput = $(this).val();
        that.cityLoader(cityInput, cityMenu, dropDownMenu, textInInput);
      }
    }
  }
  /**
   * 实现城市搜索功能
   * @method searchCities
   * @param {Object} params 参数集合
   * @param {String} params.searchBtn 搜索按钮
   * @param {String} params.form 表单
   * @param {String} params.page 使用该方法的页面
   * @param {String} params.comDis 表格的com-dis行
   * @param {String} params.district 表格的district行
   * @param {String} params.brand 表格的brand行
   */
  this.searchCities = function (params) {
    if ($(params.page).length > 0) {
      let that = this;
      $.ajax({
        type: "GET",
        url: "/api/city",
        success: function(data) {
          $.ajax({
            type: "POST",
            url: "/api/hotel",
            success: function (data2) {
              let $searchBtn = $(params.searchBtn);
              let $form = $(params.form);
              let $comDis = $(params.comDis);
              let $district = $(params.district);
              let $brandSel = $(params.brand);
              $searchBtn.click(function (e) {
                $(".my-form input").unbind("click"); // 清除能够通过该事件创建的事件，以免创建多个相同事件
                // 生成城市筛选栏
                let formDataArr = $form.serializeArray(); // 获取搜索的数据
                let formData = {};
                // 将formDataArr数组简化为一个对象，方便后续操作
                for (var i = 0, len = formDataArr.length; i < len; i++) {
                  formData[formDataArr[i].name] = formDataArr[i].value;
                }
                let searchCity = {};
                data.forEach((val) => {
                  if(val.cname === formData.city) {
                    searchCity = val;
                  }
                });
                let cityComDis = searchCity.comDis;
                let cityDistrict = searchCity.district;
                let cityBrand = searchCity.brand;
                buildSelect($comDis, cityComDis, "商圈", "comDis"); // 生成筛选栏的com-dis行
                buildSelect($district, cityDistrict, "行政区", "district"); // 生成筛选栏的distinct行
                buildSelect($brandSel, cityBrand, "品牌", "brandSel"); // 生成筛选栏的brandSel行
                // 生成城市筛选栏的公共函数
                function buildSelect(row, rowData, title, name) {
                  if(rowData.length === 0) {
                    row.css("display", "none")
                    return;
                  }else {
                    row.css("display", "table-row");
                  }
                  let filterStr = "";
                  rowData.forEach((val) => {
                    filterStr += `
                      <label class="am-checkbox am-warning">
                        <input type="checkbox" name="${name}" value="${val}" data-am-ucheck> ${val}
                      </label>
                    `;
                  });
                  filterStr = "<td>" + title + "</td><td>" + filterStr + "</td>";
                  row.html(filterStr);
                  $("input[type='checkbox']").uCheck('enable'); // 通过事件生成的元素，需要重新启用amazeui
                }

                // 搜索实现
                let newData = []; // 创建一个空数组，盛放酒店数据
                for (var i = 0, len = data2.length; i < len; i++) {
                  let str = data2[i].hotelName + data2[i].address + data2[i].type + data2[i].comDis + data2[i].district;
                  let cityReg = new RegExp(formData.city);
                  let keyReg = new RegExp(formData.keyword);
                  if (str.match(cityReg)) {
                    if (str.match(keyReg)) {
                      newData.push(data2[i]);
                    }
                  }
                }
                that.hotelLoader({
                  data: newData,
                  showMap: params.showMap
                });
                
                $(".my-form input").on("click", function(e) {
                  let selDataArr = $(".my-form").serializeArray();
                  let comDisArr = []; // 盛放被选中的商区数据
                  let districtArr = []; // 盛放被选中的区政府数据
                  let brandSelArr = []; // 盛放被选中的品牌数据
                  let facilitiesArr = []; // 盛放被选中的设施数据
                  let newData2 = [];
                  for(var i = 0, len = selDataArr.length; i < len; i ++) {
                    switch (selDataArr[i].name) {
                      case "comDis":
                        comDisArr.push(selDataArr[i].value)
                        break;
                      case "district":
                        districtArr.push(selDataArr[i].value)
                        break;
                      case "brandSel":
                        brandSelArr.push(selDataArr[i].value)
                        break;
                      case "facilities":
                        facilitiesArr.push(selDataArr[i].value)
                        break;
                    }
                  }
                  // console.log(newData)
                  // 实现筛选机制
                  for(var i = 0, len = newData.length; i < len; i ++) {
                    // 满足条件：筛选数组(comDisArr等)为空或者被筛选者(酒店)属于筛选数组时，该条数据通过筛选
                    if(comDisArr.length !== 0 && comDisArr.indexOf(newData[i].comDis) < 0) {
                      continue;
                    }
                    if(districtArr.length !== 0 && districtArr.indexOf(newData[i].district) < 0) {
                      continue;
                    }
                    if(brandSelArr.length !== 0 && brandSelArr.indexOf(newData[i].brand) < 0) {
                      continue;
                    }
                    // 判断newData[i].facilities是否包含facilitiesArr，若包含，则通过筛选
                    if(
                      facilitiesArr.every(val => {
                        return newData[i].facilities.indexOf(val) >= 0;
                      })
                    ) {
                      newData2.push(newData[i]);
                    }
                  }
                  that.hotelLoader({
                    data: newData2,
                    showMap: params.showMap
                  });
                })
              })
              $(params.searchBtn).click(); // 由于js动态生成的部分在这里已执行完成，所以此处触发click事件更为合适
            }
          });
        }
      })
    }
  }
}
export default DataTool;