
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