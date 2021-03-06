/**
 * 网页样式
 * @module StyleTool
 * @param {JQueryStatic} $ 手动引入jQuery对象
 */
function StyleTool($) {
  // #region 实现 省略new关键字也能实例化对象
  if (!this) {
    return new StyleTool($)
  }
  // #endregion
  /**
   * 导航栏下拉菜单
   * @method navDropArrow
   * @param {String} userMenuBtn 导航栏中的下拉菜单触发按钮
   */
  this.navDropArrow = function(userMenuBtn) {
    setTimeout(() => {
      let $userMenuBtnWrap = $(userMenuBtn);
      let $userMenuWrap = $userMenuBtnWrap.children(".cover");
      let $userMenuBtn = $(userMenuBtn).children("a");
      if($userMenuBtn.css("display") !== "none") {
        $userMenuBtnWrap.siblings(".down").css("display", "block");
      }
      $userMenuBtn.mouseover(function(e){
        $userMenuBtnWrap.siblings(".down").css("display", "none");
        $userMenuBtnWrap.siblings(".up").css("display", "block");
        $userMenuWrap.fadeIn();
      });
      $userMenuBtn.mouseleave(function(e) {
        $userMenuBtnWrap.siblings(".up").css("display", "none");
        $userMenuBtnWrap.siblings(".down").css("display", "block");
        $userMenuWrap.fadeOut();
      });
      $userMenuWrap.mouseover(function(e) {
        $userMenuBtnWrap.siblings(".down").css("display", "none");
        $userMenuBtnWrap.siblings(".up").css("display", "block");
        $userMenuWrap.stop();
      });
      $userMenuWrap.mouseleave(function(e) {
        $userMenuBtnWrap.siblings(".up").css("display", "none");
        $userMenuBtnWrap.siblings(".down").css("display", "block");
        $userMenuWrap.fadeOut();
      })
    });
  }
  /**
   * 首页滚动条触发导航栏透明效果
   * @method rollingTrigger
   * @param {String} page 需要使用该效果的界面节点
   */
  this.rollingTrigger = function(page) {
    if($(page).length > 0) {
      scrollTo();
      window.onscroll = function(e) {
        scrollTo();
      }
      function scrollTo() {
        // 滚动条在顶部和非顶部时分别为导航栏设置样式
        if(document.documentElement.scrollTop === 0) {
          $(".p-head").addClass("rolling-trigger");
          $(".p-head .logo").addClass("rolling-trigger");
        }else {
          setTimeout(() => {
            $(".p-head")[0].className = "p-head";
            $(".p-head .logo")[0].className = "logo";
          });
        }
      }
    }
  }
  /**
   * 显示被隐藏的内容
   * @method preventDisplayNone
   * @param {String} hoverTar 触发效果的节点
   * @param {String} tar 需要取消隐藏的节点
   */
  this.preventDisplayNone = function(hoverTar, tar) {
    setTimeout(() => {
      let $hoverTar = $(hoverTar);
      if($hoverTar.length > 0) {
        $hoverTar.on("mouseenter", function(e) {
          $(tar).slideDown(100);
        });
        $hoverTar.on("mouseleave", function(e) {
          $(tar).slideUp(100);
        });
      }
    });
  }
  /**
   * input的下拉菜单（城市列表）
   * @method dropDownMenu
   * @param {String} cilckTar 触发下拉菜单的节点
   * @param {String} menuTar 下拉菜单
   */
  this.dropDownMenu = function(cilckTar, menuTar) {
    let $clickTar = $(cilckTar);
    if($clickTar.length > 0) {
      $clickTar.on("focus", function(e) {
        $(menuTar).slideDown(150)
      });
      $clickTar.on("click", function(e) {
        $(menuTar).slideDown(150)
      });
      $clickTar.on("blur", function(e) {
        $(menuTar).slideUp(150)
      })
      $(menuTar+">div").on("mousedown", function(e) {
        e.preventDefault();
      })
      $(menuTar+">span").on("mousedown", function(e) {
        e.preventDefault();
      })
      $(menuTar+">span").on("mouseup", function(e) {
        $(cilckTar).val($(this).text());
        $(menuTar).slideUp(150);
      })
    }
  }
  /**
   * 设置时间输入框的默认值
   * @method defaultVal
   * @param {String} tar 目标元素
   * @param {String} page 执行该方法的页面
   */
  this.defaultVal = function(tar, page) {
    if($(tar).length > 0 && $(page).length > 0) {
      let nowDate = new Date();
      let nowTime = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`
      $(tar).val(nowTime);
    }
  }
  /**
   * 设置搜索栏默认值
   * @method defaultFormData
   * @param {Object} params 参数集合
   * @param {String} params.cityInput 城市输入框
   * @param {String} params.fromInput 入住时间输入框
   * @param {String} params.toInput 离店时间输入框
   * @param {String} params.keyInput 关键字输入框
   * @param {String} params.page 执行该方法的页面
   */
  this.defaultFormData = function(params) {
    if($(params.page).length > 0) {
      let localData = localStorage.getItem("Norm_find_business");
      let $fromInput = $(params.fromInput);
      let $toInput = $(params.toInput);
      let $keyInput = $(params.keyInput);
      let $cityInput = $(params.cityInput);
      if(!localData) {
        this.defaultVal($fromInput, params.page);
        this.defaultVal($toInput, params.page);
      }else {
        localData = JSON.parse(localData);
        $cityInput.val(localData.city);
        $fromInput.val(localData["from-date"]);
        $keyInput.val(localData.keyword);
        $toInput.val(localData["to-date"]);
      }
    }
  }
  /**
   * 将数据存储到本地
   * @method saveLocalstorage
   * @param {String} formData 将要存储的form数据
   * @param {String} btnTar 触发按钮
   */
  this.saveLocalstorage = function(formData, btnTar) {
    let $formData = $(formData);
    let $btnTar = $(btnTar);
    if($formData.length > 0 && $btnTar.length > 0) {
      $btnTar.on("mousedown", function(e) {
        saveFormData();
      });
    }
    function saveFormData() {
      let dataArr = $formData.serializeArray();
      let dataObj = {};
      for(let i = 0, len = dataArr.length; i < len; i ++) {
        dataObj[dataArr[i].name] = dataArr[i].value;
      }
      localStorage.setItem("Norm_find_business", JSON.stringify(dataObj));
    }
  }
  /**
   * 主页面轮播图
   * @method carousel
   * @param {Object} data 参数集合
   * @param {String} data.tar ul
   * @param {Number} data.runTime 每次动画的执行时间
   * @param {Number} data.interval 每次动画的间隔时间
   * @param {Number} data.fps 动画帧数
   * @param {String} data.btnWrap 轮播图按钮盒子
   */
  this.carousel = function(data) {
    let $tar = $(data.tar);
    if(data.tar.length > 0) {
      let $li = $tar.children("li");
      var sign = 1;
      setTimeout(() => {
        $tar.parent().height($tar.height());
      });
      if($tar.length > 0) {
        animate();
      }
      // 轮播动画
      function animate() {
        var ani = interval();
        $(data.btnWrap).on("click", "div", function(e) {
          clearInterval(ani);
          let nowSign = $(e.currentTarget).attr("value")
          let moveWidth = -($tar.width() / $li.length) * parseFloat(nowSign - 1);
          $($tar[0]).animate({
            left: moveWidth + "px"
          });
          sign = parseInt(nowSign) - 1;
          btnAni();
          ani = interval();
        });
      }
      function interval() {
        var interval = setInterval(() => {
          var anm = setInterval(() => {
            let tarW = $tar.width();
            let tarLfOfStr = $tar[0].style.left;
            let tarLf = tarLfOfStr ? parseFloat(tarLfOfStr) : 0;
            let changeOfLf = -tarW / ($li.length* data.fps);
            if(tarW/$li.length * sign + tarLf < Math.abs(changeOfLf)) {
              $tar[0].style.left = (-tarW/$li.length)*sign + "px";
              sign += 1;
              clearInterval(anm);
              if(sign === $li.length) {
                sign = 1;
                $tar[0].style.left = 0;
              }
              return;
            }
            $tar[0].style.left = tarLf + changeOfLf + "px";
          }, data.runTime/data.fps);
          btnAni();
        }, data.interval);
        return interval;
      }
      // 按钮动画
      function btnAni() {
        let $btn = $(data.btnWrap).children();
        for(var i = 0, len = $btn.length; i < len; i ++) {
          if(i === sign) {
            $btn.removeClass("click-bg");
            $btn[i].className = "click-bg"
          }else if(sign === 3) {
            $btn.removeClass("click-bg");
            $btn[0].className = "click-bg"
          }
        }
      }
    }
  }
  /**
   * 时间选择器
   * @method dateSelect
   * @param {String} fromTar 日期选中输入框(起始日期)
   * @param {String} toTar 日期选择输入框(结束日期)
   * @param {String} beforFrom 起始时间输入框前一个input节点
   */
  this.dateSelect = function(fromTar, toTar, beforFrom) {
    let $fromTar = $(fromTar);
    let $toTar =  $(toTar);
    if($fromTar.length > 0 && $toTar.length > 0) {
      // 为起始时间选择器设置触发条件
      $fromTar.on("mousedown", function(e) {
        fromTimeWrap();
      });
      $(beforFrom).on("keydown", function(e) {
        if(e.keyCode === 9) {
          fromTimeWrap();
        }
      });
      // 为结束时间选择器设置触发条件
      $toTar.on("mousedown", function(e) {
        toTimeWrap();
      });
      $fromTar.on("keydown", function(e) {
        if(e.keyCode === 9) {
          toTimeWrap();
        }
      });
      // 设置起始时间选择器
      function fromTimeWrap() {
        $fromTar.datepicker({
          minDate: 0
        });
        $fromTar.datepicker("option", "showAnim", "blind");
        $fromTar.datepicker("option", "dateFormat", "yy-mm-dd");
      }
      // 设置结束时间选择器
      function toTimeWrap() {
        let fromTarVal = $fromTar.val();
        if(fromTarVal) {
          let fromTime = new Date(fromTarVal); // 入住时间对象
          let nowTime = new Date();
          let timeDifference = fromTime - nowTime; // 获取两者毫秒差
          let tarTime = Math.ceil(timeDifference / 86400000);
          $toTar.datepicker({
            minDate: tarTime
          });
          $toTar.datepicker("option", "showAnim", "blind");
          $toTar.datepicker("option", "dateFormat", "yy-mm-dd");
        }else {
          alert("请先选择入住事件")
        }
      }
    }
  }
  /**
   * @method brandSwiper
   * @param {Object} Swiper
   */
  this.brandSwiper = function(Swiper) {
    var swiper = new Swiper('.swiper-container', {
      slidesPerView : 5,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  /**
   * 地图弹出层
   * @method showMap
   * @param {String} mapClick 触发弹出层的按钮
   */
  this.showMap = function(mapClick) {
    let $mapClick = $(mapClick);
    if($mapClick.length > 0) {
      $mapClick.on("click", function(e){
        // 获取地址
        let addr = $(this).attr("address");
        let tit = $(this).attr("tit");
        //#region 调用百度地图接口
        // 初始化地图逻辑
        var map = new BMap.Map("layerMapWrap"); // 创建地图实例
        // 添加控件
        map.addControl(new BMap.ScaleControl()); // 比例尺控件
        map.addControl(new BMap.NavigationControl()); // 平移缩放控件
        // 城市检索
        var local = new BMap.LocalSearch(map, {
          renderOptions: {
            map: map
          }
        });
        local.search(addr);
        //#endregion
        layer.open({
          type: 1,
          title: tit,
          maxmin: true,
          shadeClose: true, //点击遮罩关闭层
          area : ['1000px' , '520px'],
          content: $("#layerMapWrap")
        });
      })
    }
  }
  /**
   * 登录注册弹出层
   * @method showLogIn
   * @param {Object} params
   * @param {String} params.logInClick 触发弹出层的按钮
   * @param {String} params.logNav 需要触发界面变化的事件的按钮父元素
   * @param {String} params.phoneLog 手机登录按钮
   * @param {String} params.passwordLog 密码登录按钮
   * @param {String} params.phoneLogWrap 使用手机登录时显示的表单
   * @param {String} params.passwordLogWrap 使用密码登录时现实的表单
   * @param {String} params.smsBtn 验证码获取按钮
   * @param {String} params.phone 手机号输入框
   * @param {String} params.veri 验证码输入框 
   * @param {Object} params.userTool 登录注册等功能的调用模块对象
   */
  this.showLogIn = function(params) {
    //#region 生成登录wrap
    let layerWrapStr = `
      <div id="layerLogWrap">
        <div class="log-nav">
          <div class="lf click-style">手机登录</div>
          <div class="rt">密码登录</div>
        </div>
        <form class="for-phone">
          <input type="text" placeholder="请输入手机号码" class="phone" value="13547271471">
          <input type="text" placeholder="请输入验证码" class="veri">
          <a href="JavaScript:" class="cover">获取验证码</a>
        </form>
        <form class="for-password">
          <input type="text" placeholder="请输入手机号码" class="phone">
          <input type="text" placeholder="请输入密码" class="veri">
        </form>
        <a href="javascript:" class="btn">登录</a>
        <a href="javascript:" class="for-password">忘记密码？</a>
      </div>
    `;
    $("body").append(layerWrapStr);
    //#endregion
    
    // 实现手机登录与密码登录之间的切换
    if($(params.phoneLog) && $(params.passwordLog)) {
      $(params.logNav).on("click", "div", function(e) {
        // 避免多次绑定
        $("#layerLogWrap>.btn").unbind();
        $(this).siblings().removeClass("click-style");
        $(this).addClass("click-style");
        if($(this)[0] === $(params.phoneLog)[0]) {
          $(params.passwordLogWrap).css("display", "none");
          $(params.phoneLogWrap).css("display", "block");
        }else if($(this)[0] === $(params.passwordLog)[0]) {
          $(params.phoneLogWrap).css("display", "none");
          $(params.passwordLogWrap).css("display", "block");
        }
        // 获取短信验证码
        params.userTool.smsVeri(params.smsBtn, params.phone, params.veri);
      });
    }
    setTimeout(() => {
      if($(params.logInClick).length > 0) {
        $(params.logInClick).click(function(e) {
          layer.open({
            type: 1,
            title: false,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            area : ['389px' , '412px'],
            content: $("#layerLogWrap"),
            moveType: 0,
          });
          $(params.phoneLog).click();
        });
      }
    });
    
  }
}
export default StyleTool;