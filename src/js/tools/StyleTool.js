/**
 * 网页样式
 * @module StyleTool
 * @param {JQueryStatic} $ 需要手动引入jQuery对象
 */
function StyleTool($) {
  // #region 实现 省略new关键字也能实例化对象
  if (!this) {
    return new StyleTool($)
  }
  // #endregion
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
   * @method preventDisplyNone
   * @param {String} hoverTar 触发效果的节点
   * @param {String} tar 需要取消隐藏的节点
   */
  this.preventDisplyNone = function(hoverTar, tar) {
    setTimeout(() => {
      $(hoverTar).on("mouseenter", function(e) {
        $(tar).slideDown(200);
      });
      $(hoverTar).on("mouseleave", function(e) {
        $(tar).slideUp(200);
      });
    });
  }
  /**
   * input的下拉菜单（城市列表）
   * @method dropDownMenu
   * @param {String} cilckTar 触发下拉菜单的节点
   * @param {String} menuTar 下拉菜单
   */
  this.dropDownMenu = function(cilckTar, menuTar) {
    $(cilckTar).on("focus", function(e) {
      $(menuTar).slideDown(200)
    });
    $(cilckTar).on("click", function(e) {
      $(menuTar).slideDown(200)
    });
    $(cilckTar).on("blur", function(e) {
      $(menuTar).slideUp(200)
    })
    $(menuTar+">div").on("mousedown", function(e) {
      e.preventDefault();
    })
    $(menuTar+">span").on("mousedown", function(e) {
      e.preventDefault();
    })
    $(menuTar+">span").on("mouseup", function(e) {
      $(cilckTar).val($(this).text());
      $(menuTar).slideUp(200);
    })
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
  /**
   * @method dateSelect
   * @param {String} fromTar 日期选中输入框(起始日期)
   * @param {String} toTar 日期选择输入框(结束日期)
   */
  this.dateSelect = function(fromTar, toTar) {
    let $fromTar = $(fromTar);
    let $toTar =  $(toTar);
    if($fromTar.length > 0 && $toTar.length > 0) {
      // 为起始时间选择器设置样式
      $fromTar.datepicker({
        minDate: 0
      });
      $fromTar.datepicker("option", "showAnim", "blind");
      $fromTar.datepicker("option", "dateFormat", "yy-mm-dd");
      // 为结束时间选择器设置样式
      $toTar.datepicker({
        minDate: 0
      });
      $toTar.datepicker("option", "showAnim", "blind");
      $toTar.datepicker("option", "dateFormat", "yy-mm-dd");
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
   * @method showMap
   * @param {String} mapClick 触发弹出框效果的节点
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

        // let addr = $("#layerMapWrap").attr("address");
      })
    }
  }
}
export default StyleTool;