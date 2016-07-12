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

var app = angular.module("App",[]).controller("subscribeListCtrl",function($scope,appService){
    var subscribeList = appService.selectReservationByUser();
    $scope.subscribeList = subscribeList;
    if(!subscribeList){
        return ;
    }
    $scope.subscribeLeng = subscribeList.length;
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

    $scope.cancel = function () {

        var sl = this.sl;

        $("#open-modal2 h3").html(sl.time + "<br>" + sl.info);

        $("#open-modal2 .cancel").click(function(){
            var apire = Api.cancelReservation(sl.reservationId);
            if(apire.success){
                
                $scope.$apply(function () {
                    $scope.subscribeList = appService.selectReservationByUser();
                });

            }else{
                console.log(apire.message);
            }
        });

    }

})

app.factory("appService",function () {

    var factory = {}

    factory.selectReservationByUser = function () {

        var list = Api.selectReservationByUser();
        if(!list.success){
            $(".app-null").show();
            return null;
        }
        var lists = list.list;

        for(var l = 0 ; l < lists.length ; l++){
            var beginTime = lists[l].sreservationBeginTime;
            var now = new Date()
            var begin = new Date(beginTime);
            var _hm = Math.abs(begin-now)/1000/60;
            lists[l].h = parseInt(_hm / 60);
            lists[l].m = parseInt(_hm % 60);
            lists[l].hm = parseInt(_hm / 60) +"小时"+parseInt(_hm % 60)+"分钟";

        }
        return  lists;
    }

    return factory;
});