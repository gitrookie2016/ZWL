/**
 * Created by Lix on 2016-7-18.
 */

var contractApp = angular.module("App",[]);



contractApp.controller("contractCtrl",function ($scope) {
    var contractInfo = g.toJson($.cookie("contractInfo"));

    $scope.info = contractInfo.info;
    $scope.sreservationBeginTime = contractInfo.sreservationBeginTime;
    $scope.sreservationEndTime = contractInfo.sreservationEndTime;

    $scope.submit = function () {
        var _st = $(".span_Time")[0].innerHTML;

        var st = _st.replace("-" , "/").replace("-" , "/");
        var cse = contractInfo.sreservationEndTime;
        cse = cse.replace("-" , "/").replace("-" , "/");

        if(new Date(st) - new Date(cse) > 0) {
            var reapi = Api.extendSeatTime(contractInfo.reservationId, _st);
            if (reapi.success) {
                $.cookie("muiFlag",1,{path:"/"});
                window.location = "index.html";

            } else {
                mui.toast(reapi.message ? reapi.message : "未知错误");
            }
        }else{
            mui.toast("续约时间要大于结束时间");
        }
    }

});

(function($) {
    $.init();
    var result = $('#result')[0];
    var btns = $('.btn');
    btns.each(function(i, btn) {
        btn.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            /*
             * 首次显示时实例化组件
             * 示例为了简洁，将 options 放在了按钮的 dom 上
             * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
             */
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                result.innerText = '选择结果: ' + rs.text;
                var stt = $(".span_Time")[0].innerHTML;
                stt = stt.substring(0,11);
                stt = stt + rs.h.value + ":" + rs.i.value + ":" + "00";
                $(".span_Time")[0].innerText = stt;
                /*
                 * 返回 false 可以阻止选择框的关闭
                 * return false;
                 */
                /*
                 * 释放组件资源，释放后将将不能再操作组件
                 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                 */
                picker.dispose();
            });
        }, false);
    });
})(mui);