/**
 * Created by Lix on 2016-7-1.
 */

$(document).ready(function(){
    /**
     * index.js
     */
    var _ui = g.userInfo();
    if(_ui){
        $(".g-userName").html("姓名："+_ui.userName);
        $(".g-userNum").html("学号："+_ui.userNum);
        if(_ui.major){
            $(".g-major").html("专业："+_ui.major);
        }else{
            $(".g-major").html("专业：");
        }
        if(typeof _ui.headPortrait != "undefined"){
            var userPhoto = _ui.headPortrait;
            if(userPhoto){
                $(".face").attr("src",g.localData.get("userPhoto"));
            }
        }

    }
});

var app = angular.module("App",[]);

    app.controller("subscribeListCtrl",function($scope,appService){

        var flag = parseInt($.cookie("muiFlag"));
        if(flag){
            switch (flag){
                case 1 :
                    mui.toast("续约成功");

                    break;
                case  2 :
                    mui.toast("座位更换成功");
            }
            $.removeCookie("muiFlag",{  path: '/' });
        }


        /**
         * 续约
         */
        $scope.contract = function () {
            var sl = this.sl;
            var bean = {
                "info"      :   sl.info,
                "time"      :   sl.time,
                "sreservationBeginTime"      :   sl.sreservationBeginTime,
                "sreservationEndTime"      :   sl.sreservationEndTime,
                "reservationId"      :   sl.reservationId,
                "seatNum"   :   sl.seatNum
            }

            $.cookie("contractInfo",JSON.stringify(bean), {  path: '/' });

            window.location = "contract.html";
        }

        $scope.alertBtn =  function () {
            $(".more-yxs").show();
        }

        var subscribeList = appService.selectReservationByUser();
        if(!subscribeList){
            return ;
        }
        $scope.subscribeList = subscribeList.lists;
        var roomReservation = subscribeList.roomReservation;
        var roomReservationList;
        var ab = 0;

        var sll = typeof subscribeList.lists != "undefined" ? subscribeList.lists.length : 0;
        $scope.subscribeLeng = sll ;
        if(typeof roomReservation != "undefined"){
            roomReservationList = roomReservation.roomReservationList;//


            $scope.roomReservation = roomReservation;
            $scope.roomReservationList = appService.roomReservationList = roomReservationList;

            ab = 1;
            $scope.roomReservationLeng = parseInt(sll) + ab;
        }else{
            $("#roomReservation").hide();
        }
        /**
         * 更换座位
         */
        $scope.changeSeat = function () {
            var changeSeatInfo = this.sl;

            $.cookie("changeSeatInfo",JSON.stringify(changeSeatInfo),{path:"/"});

            window.location = "#open-modal1";
        }
        $scope.checkSeat = function () {

            var sl = this.sl;


            var bean = {
                "info"      :   sl.info,
                "time"      :   sl.time,
                "sreservationBeginTime"      :   sl.sreservationBeginTime,
                "sreservationEndTime"      :   sl.sreservationEndTime,
                "classroomId"      :   sl.classroomId,
                "seatNum"   :   sl.seatNum
            }

            $.cookie("checkSeatInfo",JSON.stringify(bean), {  path: '/' });
            window.location = "checkSeat.html";
        }

        /**
         * 取消座位
         */
        $scope.cancel = function () {

            var sl = this.sl;

            $("#open-modal2 h3").html(sl.time + "<br>" + sl.info);

            $("#open-modal2 .cancel").click(function(){
                var apire = Api.cancelReservation(sl.reservationId);
                if(apire.success){

                    $scope.$apply(function () {
                        var subscribeListTwo = appService.selectReservationByUser();
                        if(subscribeListTwo) {

                            $scope.subscribeList = subscribeListTwo.lists;
                            if(subscribeListTwo.lists){
                                $scope.subscribeLeng = subscribeListTwo.lists.length;
                            }

                        }
                    });
                    mui.toast("座位取消成功");
                }else{
                    console.log(apire.message);
                    mui.toast(apire.message);
                }
            });

        }

});

app.controller("moreYXSCtrl",function ($scope,appService) {
    $scope.roomReservationList = appService.roomReservationList;

    $scope.close = function(){
        $(".more-yxs").hide();
    }
});

app.factory("appService",function () {

    var factory = {}

    factory.selectReservationByUser = function () {

        var list = Api.selectReservationByUser();
        if(!list.success){
            $(".app-null").show();
            $(".seat-list").hide();
            return null;
        }
        var bean = {};
        var lists = list.list;
        if(typeof lists !="undefined" && lists.length > 0) {
            for (var l = 0; l < lists.length; l++) {

                var beginTime = lists[l].sreservationBeginTime;
                var _hm = factory.contrastTime(beginTime);
                lists[l].h = parseInt(_hm / 60);
                lists[l].m = parseInt(_hm % 60);
                lists[l].hm = parseInt(_hm / 60) + "小时" + parseInt(_hm % 60) + "分钟";

            }
            bean.lists = lists;
        }
        var roomReservation = list.roomReservation;

        if(typeof roomReservation != "undefined"){

            var rvl =  roomReservation.roomReservationList
            for(var rrv = 0 ; rrv < rvl.length ; rrv++){
                var ct = factory.contrastTime(rvl[rrv].time.substring(0,16) + ":00");
                rvl[rrv].ct = parseInt(ct / 60) + "小时" + parseInt(ct % 60) + "分钟";
            }
            roomReservation.roomReservationList = rvl;
            bean.roomReservation = roomReservation;
        }

        return bean;


    }
    factory.contrastTime = function (a) {
        var SysTime = Api.getSystemTime();
        SysTime = SysTime.replace("-","/");
        SysTime = SysTime.replace("-","/");
        var now = new Date(SysTime);
        a = a.replace("-","/");
        a = a.replace("-","/");
        var begin = new Date(a);
        return Math.abs(begin - now) / 1000 / 60;
    };


    return factory;
});

$(document).ready(function () {
    mui.init();
    var btnArray = ['确认', '取消'];
    $('#OA_task_1').on('tap', '.mui-btn', function(event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
            if (e.index == 0) {
                var lv = li.getAttributeNode("name").value;
                if(lv){
                    var reapi = Api.cancleReservation(lv);
                    if(reapi.success){
                        li.parentNode.removeChild(li);
                    }else{
                        mui.toast(reapi.message);
                    }

                }

            } else {
                setTimeout(function() {
                    this.$.swipeoutClose(li);
                }, 0);
            }
        });
    });
});