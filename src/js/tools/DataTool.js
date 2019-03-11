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
   */
  this.brandDataLoader = function(params) {
    if($(params.page).length > 0) {
      $.ajax({
        type: "GET",
        url: "/api/brand",
        success: function(data) {
          let $swiperSlide = $(params.swiperSlide);
          $swiperSlide.on("click", function(e) {
            // 防止点击a标签界面跳转
            e.preventDefault();
            let $clickSwiperSlide = $(this)
            // 点击按钮实现变化
            $clickSwiperSlide.parent(".swiper-slide").siblings(".swiper-slide").children("a").removeClass("click-style");
            $clickSwiperSlide.addClass("click-style");
            // 获取所选中的品牌
            let brandName = $clickSwiperSlide.attr("brandName");
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
      })
    }
  }
}
export default DataTool;