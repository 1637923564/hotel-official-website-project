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
   * 设置搜索栏默认数据
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
   * @param {String} sFormData search页面的form数据
   * @param {String} sBtnTar search页面的触发按钮
   */
  this.saveLocalstorage = function(formData, btnTar) {
    let $formData = $(formData);
    let $btnTar = $(btnTar);
    if($formData.length > 0 && $btnTar.length > 0) {
      $btnTar.on("mousedown", function(e) {
        console.log($formData.serializeArray())
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
          let fromTime = new Date(fromTarVal);
          let nowTime = new Date();
          let timeDifference = fromTime - nowTime;
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