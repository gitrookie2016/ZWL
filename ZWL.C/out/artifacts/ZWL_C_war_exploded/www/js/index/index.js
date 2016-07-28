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


    app.controller("subscribeListCtrl",function($scope,appService,$http){


        /**
         * 扫码就坐
         *
         */
        $scope.SweepCode = function () {
            var rs;
            wx.scanQRCode({
                needResult: 1,
                success: function (res,e) {
                    rs = res.resultStr;
                    //mui.toast(rs.indexOf("R"));
                    if(rs.toString().indexOf("R") == -1){
                        mui.toast(1);
                        var reApi = Api.scanQrCode(rs);
                        mui.toast(2);
                        mui.toast(reApi);
                        if(reApi.success && reApi.message != 0){
                            $scope.$apply(function () {
                                var subscribeListTwo = appService.selectReservationByUser();
                                if(subscribeListTwo) {

                                    $scope.subscribeList = subscribeListTwo.lists;
                                    if(subscribeListTwo.lists){
                                        $scope.subscribeLeng = subscribeListTwo.lists.length;
                                    }

                                }
                            });
                            mui.toast("签到成功");
                        }else{
                            mui.toast(reApi.message);
                            mui.toast(reApi.success);
                            if(reApi.message == 0){
                                var bean = {};

                                var list = reApi.object;
                                if(list){
                                    bean.buildingName   = list.buildingName;
                                    bean.seatNum        = list.seatNum;
                                    bean.campusName     = list.campusName;
                                    bean.classroomNum   = list.classroomNum;
                                    bean.dayBeginTime   = list.dayBeginTime;
                                    bean.dayEndTime     = list.dayEndTime;
                                    bean.seatNum        = list.seatNum;
                                    bean.floor          = list.floor;
                                    bean.seatId         = rs;

                                    $.cookie("contractZXS",JSON.stringify(bean), {  path: '/' });
                                    window.location = "sweepCode.html";

                                }else{
                                    mui.toast("扫码失败！");
                                }

                            }else  if(reApi.message == 3){
                                mui.toast("已签到或迟到！");
                            }else  if(reApi.message == 2){
                                mui.toast("离开中（临时离开、午饭、晚饭）");
                            }

                        }
                    }else{
                        var identifyCode ;
                        var btnArray = ["确认","取消"];
                        mui.prompt("请输入预约码", rs,  btnArray, function(e) {
                            if (e.index == 1) {

                                identifyCode = e.value;

                                if(identifyCode){
                                    var reApi = Api.signIn(identifyCode,rs.substring(1,rs.length));
                                    if(reApi){
                                        if( reApi.success){
                                            $scope.$apply(function () {
                                                appService.yxsApply();
                                                $scope.subscribeLeng = appService.subscribeLeng;
                                                $scope.roomReservation = appService.roomReservation;
                                                $scope.roomReservationList = appService.roomReservationList = appService.roomReservationList;
                                                $scope.roomReservationLeng = appService.roomReservationLeng
                                            });
                                            mui.toast("签到成功");
                                        }else{
                                            mui.toast("签到失败!"+reApi.message);
                                            return null;
                                        }
                                    }
                                }else{
                                    mui.toast("请输入预约码");
                                    return null;
                                }

                            } else {
                                mui.toast("签到失败");
                                return null;
                            }
                        })
                    }
                }
            });
        }


        /**
         * 研修室签到
         * arg 预约码
         */
        $scope.signIn = function () {
            var rs ;
            var identifyCode ;
            var btnArray = ["确认","取消"];

            wx.scanQRCode({
                    needResult: 1,
                    success: function (res,e) {
                        rs = res.resultStr;
                        mui.prompt("请输入预约码", rs,  btnArray, function(e) {
                            if (e.index == 1) {

                                identifyCode = e.value;

                                if(identifyCode){
                                    var reApi = Api.signIn(identifyCode,rs.substring(1,rs.length));
                                    if(reApi){
                                        if( reApi.success){
                                            $scope.$apply(function () {
                                                appService.yxsApply();
                                                $scope.subscribeLeng = appService.subscribeLeng;
                                                $scope.roomReservation = appService.roomReservation;
                                                $scope.roomReservationList = appService.roomReservationList = appService.roomReservationList;
                                                $scope.roomReservationLeng = appService.roomReservationLeng
                                            });
                                            mui.toast("签到成功");
                                        }else{
                                            mui.toast("签到失败!"+reApi.message);
                                            return null;
                                        }
                                    }
                                }else{
                                    mui.toast("请输入预约码");
                                    return null;
                                }

                            } else {
                                mui.toast("签到失败");
                                return null;
                            }
                        })


                    }
                });




        }


        /**
         * 签到
         */
        $scope.checkIn = function(){

            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {

                    var rs = res.resultStr;
                    var reApi = Api.checkInSeat(rs);
                    if(reApi.success && reApi.message != 0){
                        $scope.$apply(function () {
                            var subscribeListTwo = appService.selectReservationByUser();
                            if(subscribeListTwo) {

                                $scope.subscribeList = subscribeListTwo.lists;
                                if(subscribeListTwo.lists){
                                    $scope.subscribeLeng = subscribeListTwo.lists.length;
                                }

                            }
                        });
                        mui.toast("签到成功");
                    }else{
                        mui.toast("签到失败");
                    }

                }
            });
        }


        /**
         * 离席
         */
        $scope.checkOut = function () {
            appService.LeaveReservationId = this.sl.reservationId;
            $(".leave-div").show();


        }

        $scope.leave_close = function () {
            $(".leave-div").hide();
        }

        /**
         * 离开
         */
        $scope.leave = function (arg) {
            if(parseInt(arg) == 1){

                $.cookie("leaveTime", new Date() , {path : "/"});
            }
            var reApi = Api.leave(appService.LeaveReservationId,arg);
            if(reApi && reApi.success){

                    var subscribeListTwo = appService.selectReservationByUser();
                    if(subscribeListTwo) {

                        $scope.subscribeList = subscribeListTwo.lists;
                        if(subscribeListTwo.lists){
                            $scope.subscribeLeng = subscribeListTwo.lists.length;
                        }

                    }

                $(".leave-div").hide();
                mui.toast(reApi.message);
            }else{
                $(".leave-div").hide();
                mui.toast(reApi.message);
            }
        }

        var _ui = g.userInfo();

        $scope.temporary = "临时离开（允许离开最大时长5分钟）";
        $scope.lunch = "午餐（"+_ui.lunchStartTime + "-"  +_ui.lunchEndTime +"）";
        $scope.dinner = "晚餐（"+_ui.dinnerStartTime + "-" +_ui.dinnerEndTime +"）";









        /**
         * 提示
         * @type {Number}
         */
        var flag = parseInt($.cookie("muiFlag"));
        if(flag){
            switch (flag){
                case 1 :
                    mui.toast("续约成功");

                    break;
                case  2 :
                    mui.toast("座位更换成功");
                    break;
                case  3 :
                    mui.toast("预约成功并已签到");
                    break;
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
        appService.subscribeList = subscribeList;
        if(!subscribeList){
            return ;
        }
        $scope.subscribeList = subscribeList.lists;

        /**
         * 研修室
         */
        appService.yxsApply();
        $scope.subscribeLeng = appService.subscribeLeng;
        $scope.roomReservation = appService.roomReservation;
        $scope.roomReservationList = appService.roomReservationList = appService.roomReservationList;
        $scope.roomReservationLeng = appService.roomReservationLeng

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


        $scope.roomReservationList = appService.roomReservationList;

        $scope.signOutYXS = function(arg){

            var reApi = Api.signOutYXS(arg);
            if(reApi){
                if(reApi.success){
                    appService.yxsApply();
                    $scope.subscribeLeng = appService.subscribeLeng;
                    $scope.roomReservation = appService.roomReservation;
                    $scope.roomReservationList = appService.roomReservationList = appService.roomReservationList;
                    $scope.roomReservationLeng = appService.roomReservationLeng
                    mui.toast(reApi.message);
                }else{
                    mui.toast(reApi.message);
                }
            }
        }


        /**
         * 研修室查看关闭
         */
        $scope.close = function (){
            $(".more-yxs").hide();
        }


        /**
         * 研修室查看
         */
        var btnArray = ['确认', '取消'];
        $('#OA_task_1').on('slideleft', '.mui-table-view-cell', function(event) {
            var elem = this;

            mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
                if (e.index == 0) {
                    var lv = elem.getAttributeNode("name").value;
                    if(lv){
                        var reapi = Api.cancleReservation(lv);
                        if(reapi.success){
                            elem.parentNode.removeChild(elem);

                            //删掉后更新页面
                            appService.yxsApply();
                            $scope.subscribeLeng = appService.subscribeLeng;
                            $scope.roomReservation = appService.roomReservation;
                            $scope.roomReservationList = appService.roomReservationList = appService.roomReservationList;
                            $scope.roomReservationLeng = appService.roomReservationLeng

                            var ocl = $("#OA_task_1").children().length
                            if(ocl == 0){
                                $(".more-yxs").hide();
                            }
                        }else{
                            mui.toast(reapi.message);
                        }

                    }

                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(elem);
                    }, 0);
                }
            });
        });


});


app.factory("appService",function () {

    var factory = {}
    factory.SysTime = null;
    factory.yxsApply = function(){

        var roomReservation = factory.selectReservationByUser();
        var roomReservationList;
        var ab = 0;

        var sll = typeof factory.subscribeList.lists != "undefined" ? factory.subscribeList.lists.length : 0;
        factory.subscribeLeng = sll;
        if (typeof roomReservation != "undefined" && roomReservation != null && roomReservation.roomReservation) {

            roomReservationList = roomReservation.roomReservation.roomReservationList;//

            factory.roomReservation = roomReservation.roomReservation;
            factory.roomReservationList = factory.roomReservationList = roomReservationList;
            ab = 1;
            factory.roomReservationLeng = parseInt(sll) + ab;
        } else {
            $("#roomReservation").hide();
        }

    }
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
                if(!factory.compare(beginTime)){
                    lists[l].hm = "0小时0分钟";
                }
                if( lists[l].notArrive == 2 ){
                    if(lists[l].leaveFlag == 1){
                        lists[l].leavehm = parseInt(lists[l].canUseMinute / 60 ) + "分钟" + parseInt(lists[l].canUseMinute % 60 ) + "秒";
                    }
                    if(lists[l].leaveFlag == 2){//午饭离开

                        lists[l].leavehm = parseInt(lists[l].canUseMinute / 60 ) + "分钟" + parseInt(lists[l].canUseMinute % 60 ) + "秒";
                    }
                    if(lists[l].leaveFlag == 3){//晚饭离开

                        lists[l].leavehm = parseInt(lists[l].canUseMinute / 60 ) + "分钟" + parseInt(lists[l].canUseMinute % 60 ) + "秒";
                    }

                    var EndTime = lists[l].sreservationEndTime;
                    var Endhm = factory.contrastTime(EndTime);
                    lists[l].Endhm = parseInt(Endhm / 60) + "小时" + parseInt(Endhm % 60) + "分钟";

                }

            }
            bean.lists = lists;
        }
        var roomReservation = list.roomReservation;

        if(typeof roomReservation != "undefined"){

            var rvl =  roomReservation.roomReservationList
            for(var rrv = 0 ; rrv < rvl.length ; rrv++){
                var ct = factory.contrastTime(rvl[rrv].time.substring(0,16) + ":00");
                rvl[rrv].ct = parseInt(ct / 60) + "小时" + parseInt(ct % 60) + "分钟";
                if(!factory.compare(rvl[rrv].time.substring(0,16))){
                    rvl[rrv].ct = "0小时0分钟";
                }
                if(rvl[rrv].notArrive == 2){
                    var TET = factory.contrastTime(rvl[rrv].time.substring(0,11) +rvl[rrv].time.substring(19)+ ":00");
                    rvl[rrv].toEndTime = parseInt(TET / 60) + "小时" + parseInt(TET % 60) + "分钟";
                }
            }
            roomReservation.roomReservationList = rvl;
            bean.roomReservation = roomReservation;
        }
        factory.SysTime = null;
        return bean;


    }


    factory.compare = function(a){
        var SysTime;
        if(factory.SysTime){
            SysTime = factory.SysTime;
        }else{
            SysTime = factory.SysTime = Api.getSystemTime();
        }
        SysTime = SysTime.replace("-","/");
        SysTime = SysTime.replace("-","/");
        var now = new Date(SysTime);
        a = a.replace("-","/");
        a = a.replace("-","/");
        var begin = new Date(a);
        var compare = begin - now;
        if(compare > -1){
            return true;
        }else{
            return false;
        }

    }

    factory.contrastTime = function (a) {

        var SysTime;
        if(factory.SysTime){
            SysTime = factory.SysTime;
        }else{
            SysTime = factory.SysTime = Api.getSystemTime();
        }


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

app.directive("zwlyxsindex",function(){
    return {

        templateUrl : "template/yxs_index.html"

    };
});

app.directive("zwlzxsindex",function(){
    return {

        templateUrl : "template/zxs_index.html"

    };
});

app.controller("alertChangeSeatCtrl",function ($scope) {
    /**
     * 扫码
     * @constructor
     */
    $scope.QRCode = function(){
        QRCode();
    }
});

$(document).ready(function () {
    mui.init();

});
