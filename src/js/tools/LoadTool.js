/**
 * 自动加载部分模块
 * @module LoadTool
 * @param {JQueryStatic} $ 需要手动传入jQuery对象
 */
function LoadTool($) { 
  // #region 实现 省略new关键字也能实例化对象
  if(!this) {
    return new LoadTool($)
  }
  // #endregion

  /**
   * 加载页面的公共部分
   * @method headTool
   * @for LoadTool
   * @param {String} head 头部导航栏
   * @param {String} foot 页面底部导航栏
   */
  this.loader = function(head, foot) {
    let $pHead = $(head);
    let $pFoot = $(foot);
    // 将数据分别写入 p-head 和 p-foot
    if($pHead.length > 0) {
      $.ajax({
        url: "/head.html",
        success: function(data) {
          $pHead.html(data);
        }
      });
    }
    if($pFoot.length > 0) {
      $.ajax({
        url: "/foot.html",
        success: function(data) {
          $pFoot.html(data);
        }
      });
    }
  }
}
export default LoadTool;