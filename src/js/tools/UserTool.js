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
      // 点击按钮之后，按钮样式将会变成不可点击样式，并实现60s的倒计时
      let time = 60;
      $smsBtn.unbind();
      $smsBtn.css("background", "#eee");
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
          $("#layerLogWrap>.btn").css("cursor", "pointer");
          setTimeout(() => {
            $("#layerLogWrap>.btn").css("cursor", "no-drop");
            $("#layerLogWrap>.btn").unbind();
          }, 70000);
          $("#layerLogWrap>.btn").click(function(e) {
            if($(phone).val() === phoneNum && parseInt($(veri).val()) === veriCode) {
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
                        Cookies.set("Authorization", data.token, { expires: 7 });
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
                              Cookies.set("Authorization", data.token, { expires: 7 });
                            }
                          })
                        }
                      }
                    })
                  }
                }
              });
            }
          })
        }
      });
      setTimeout(() => {
        clearInterval(countdown);
        $smsBtn.text("获取验证码");
        $smsBtn.css("background", "rgb(231,208,115)")
        $smsBtn.click(smsBtnCallback);
      }, 60000);
    }
    $smsBtn.click(smsBtnCallback);
  }
}

export default UserTool;