import Cookies from "js-cookie";
/**
 * @module 注册登录等功能的接口调用
 * @param {JQueryStatic} $
 */
function UserTool($) {
  // #region 实现 省略new关键字也能实例化对象
  if (!this) {
    return new StyleTool($)
  }
  //#endregion
  /**
   * 调用短信验证接口
   * @method smsVeri
   * @param {String} smsBtn 验证码获取按钮
   * @param {String} phone 手机号输入框
   */
  this.smsVeri = function (smsBtn, phone, veri) {
    let $smsBtn = $(smsBtn);
    function smsBtnCallback(e) {
      let loadAm1 = layer.load();
      // 点击按钮之后，按钮样式将会变成不可点击样式，并实现60s的倒计时
      let time = 60;
      $smsBtn.unbind();
      $smsBtn.css("background", "#ccc");
      $smsBtn.text(time);
      $smsBtn.css("cursor", "no-drop");
      let countdown = setInterval(() => {
        time --;
        $smsBtn.text(time);
      }, 1000);
      let phoneNum = $(phone).val();
      // 生成一个[10000, 99999]的随机数
      let veriCode = parseInt(Math.random() * (99999 - 10000 + 1)) + 10000;
      // 短信验证接口调用和登录按钮绑定
      $.ajax({
        type: 'post',
        url: 'http://route.showapi.com/28-1',
        dataType: 'json',
        data: {
          "showapi_appid": '86878', //这里需要改成自己的appid
          "showapi_sign": '13a09830d1994f3babc20674d3e6502f',  //这里需要改成自己的应用的密钥secret
          "mobile": phoneNum,
          "content": "{\"code\":\"" + veriCode + "\",\"type\":\"登录\"}",
          "tNum": "T170317004080"
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
          alert("服务器繁忙，请稍后再重试!");
        },
        success: function (result) {
          setTimeout(() => {
            layer.close(loadAm1);
          }, 500);
          $("#layerLogWrap>.btn").css("cursor", "pointer");
          setTimeout(() => {
            $("#layerLogWrap>.btn").css("cursor", "no-drop");
            $("#layerLogWrap>.btn").unbind();
          }, 180000);
          $("#layerLogWrap>.btn").click(function(e) {
            if($(phone).val() === phoneNum && Number($(veri).val()) === veriCode) {
              let loadAm2 = layer.load();
              // 验证手机号是否已经注册
              $.ajax({
                type: "POST",
                url: "/veri/veri_user",
                data: { phoneNum },
                success: function(data) {
                  if(data.msg) {
                    // 直接登录
                    $.ajax({
                      type: "POST",
                      url: "/veri/login",
                      data: { phoneNum, veriSign: true },
                      success: function(data) {
                        setTimeout(() => {
                          layer.close(loadAm2);
                          Cookies.set("Authorization", data.token);
                          location.reload();
                        }, 500);
                      }
                    })
                  }else {
                    // 先注册再登录
                    $.ajax({
                      type: "POST",
                      url: "/veri/register",
                      data: { phoneNum, password: "000000"},
                      success: function(data) {
                        if(data.msg === "success") {
                          // 登录
                          $.ajax({
                            type: "POST",
                            url: "/veri/login",
                            data: { phoneNum, veriSign: true },
                            success: function(data) {
                              setTimeout(() => {
                                layer.close(loadAm2);
                                Cookies.set("Authorization", data.token);
                                location.reload();
                              }, 500);
                            }
                          })
                        }
                      }
                    });
                  }
                }
              });
            }else {
              layer.msg("请输入正确的验证码");
            }
          }) ;
        }
      });
      setTimeout(() => {
        clearInterval(countdown);
        $smsBtn.text("获取验证码");
        $smsBtn.css("background", "rgb(231,208,115)");
        $smsBtn.css("cursor", "pointer");
        $smsBtn.click(smsBtnCallback);
      }, 60000);
    }
    $smsBtn.click(smsBtnCallback);
  }
  /**
   * 验证用户是否为登录状态
   * @method isLogIn
   * @param {String} userMenu 导航栏中的userMenu下拉菜单触发按钮
   * @param {String} unLog 导航栏中的登录/注册按钮
   */
  this.isLogIn = function() {
    let token = Cookies.get("Authorization");
    if(token) {
      $.ajax({
        url: "/veri/verifi",
        type: "GET",
        headers: {
          Authorization: token
        },
        success: function(data) {
          // data = { msg: isSuccess, user: user info}
          $(".nav-list .user-menu").children("a").text(data.user.name);
          $(".nav-list .user-menu").children("a").css("display", "inline");
          $(".nav-list .un-log").children().css("display", "none");
        },
        error: function(err) {
          if(err.responseText === "Unauthorized") {
            console.log("Unauthorized");
            if($(".personage").length > 0) {
              $(".personage").html(""); // 如果不是登录状态，先将界面清空
              history.back();
            }
          }
        }
      });
    }else if(!token && $(".personage").length > 0) {
      $(".personage").html(""); // 如果不是登录状态，先将界面清空
      history.back();
    }
  }
  /**
   * 个人主页订单加载及生成
   * @method orderLoader
   * @param {String} page 需要订单数据的界面
   * @param {String} cancelBtn 取消订单按钮
   */
  this.orderLoader = function(page, cancelBtn) {
    if($(page).length > 0) {
      $.ajax({
        type: "GET",
        url: "/veri/verifi",
        headers: {
          Authorization: Cookies.get("Authorization")
        },
        success: function(data) {
          let order = data.user.order;
          let elStr = "";
          if(order.length === 0) {
            elStr = "暂时没有订单";
          }else {
            order.forEach(item => {
              elStr += `
                <div class="order">
                  <div class="top">
                    <span class="order-num">订单号：${item.orderNum}</span>
                    <span class="order-time">下单时间：${item.orderTime}</span>
                  </div>
                  <div class="bottom">
                    <div class="img">
                      <img src="${item.bg}" address="${item.address}" tit="${item.hotel}">
                    </div>
                    <div class="info">
                      <div class="one">
                        <span class="hotel">${item.hotel}</span>
                        <span class="type">${item.type}</span>
                        <span class="money">订单金额：${item.money}</span>
                      </div>
                      <div class="two">
                        <span class="validityPeriod">${item.validityPeriod}</span>
                        <span class="time">${item.time}晚</span>
                      </div>
                      <div class="three">
                        <a href="javascript:" hotel="${item.hotel}">取消订单</a>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            });
          }
          $(".order-list").html(elStr);
          
          $(cancelBtn).click(function(e) {
            let hotel = $(this).attr("hotel");
            $.ajax({
              url: "/order/del?hotel=" + hotel,
              type: "GET",
              headers: {
                Authorization: Cookies.get("Authorization")
              },
              success: function(data) {
                location.reload();
              }
            })
          });
        },
        error: function(err) {
          console.log(err.message)
        }
      });
    }
  }
  /**
   * 订单添加
   * @method addOrder
   */
  this.addOrder = function(btn) {
    if($(btn).length > 0) {
      $(btn).click(function(e) {
        let tar = this;
        // 先判断是否为登录状态
        $.ajax({
          url: "/veri/verifi",
          type: "GET",
          headers: {
            Authorization: Cookies.get("Authorization")
          },
          success: function(data) {
            if(data.msg === "success") {
              let hotel = $(tar).attr("hotelName");
              $.ajax({
                type: "GET",
                url: "/api/find?hotelName=" + hotel,
                success: function(data) {
                  if(data.msg) {
                    let getHotel = data.hotel;
                    let loadAm = layer.load();
                    // 生成区间 [10000000000000 ,99999999999999]的数，使其作为订单号
                    let orderNum = parseInt(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;
                    // { orderNum, type, hotel, time:入住天数, validityPeriod:有效期, orderTime:下单时间, bg, address, money }
                    // 获取当前时间
                    let nowTime = new Date();
                    let year = nowTime.getFullYear(),
                        month = nowTime.getMonth().toString(),
                        day = nowTime.getDate(),
                        h = nowTime.getHours().toString(),
                        m = nowTime.getMinutes().toString(),
                        s = nowTime.getSeconds().toString();
                    let orderTime = year + "-" + (month.length>1 ? month : (0 + month)) + "-" + day + " " + (h.length>1 ? h : (0 + h)) + ":" + (m.length>1 ? m : (0 + m)) + ":" + (s.length>1 ? s : (0 + s));
                    // 拿取本地localStorage的住房时间并转换成时间对象
                    let localData = JSON.parse(localStorage.getItem("Norm_find_business"));
                    let time = Math.ceil((new Date(localData["to-date"]) - new Date(localData["from-date"])) / 86400000);
                    let addData = {
                      orderNum,
                      type: getHotel.type,
                      hotel: getHotel.hotelName,
                      time,
                      validityPeriod: localData["from-date"] + " ~ " + localData["to-date"],
                      orderTime,
                      bg: getHotel.hotelBg,
                      address: getHotel.address,
                      money: 750
                    };
                    $.ajax({
                      type: "POST",
                      url: "/order/add",
                      data: addData,
                      headers: {
                        Authorization: Cookies.get("Authorization")
                      },
                      success: function(data) {
                        if(data.msg) {
                          // 此处调用短信API +++++++++++
                          setTimeout(() => {
                            layer.close(loadAm);
                            layer.msg('预定成功');
                          }, 1000);
                        }else {
                          setTimeout(() => {
                            layer.close(loadAm);
                            layer.msg(data.prompt);
                          }, 1000);
                        }
                      }
                    });
                    
                  }
                }
              })
            }
          },
          error: function(err) {
            if(err.responseText === "Unauthorized") {
              // 未登录，弹出登录框
              $(".un-log>a").click();
            }
          }
        });
      });
    }
  }
}

export default UserTool;