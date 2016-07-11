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
})

app.factory("appService",function () {

    var factory = {}

    factory.selectReservationByUser = function () {

        var list = Api.selectReservationByUser();

        var lists = list.list;

        for(var l = 0 ; l < lists.length ; l++){
            var beginTime = lists[l].sreservationBeginTime;
            var now = new Date().Format("yyyy/MM/dd hh:ss:mm");
            var begin = new Date(beginTime).Format("yyyy/MM/dd hh:ss:mm");
            var Under = (Date.parse(begin) - Date.parse(now)) / 86400000 * 24;
            console.log(Under);
        }
        return  lists;
    }

    return factory;
});