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
            $(".face").attr("src",_ui.headPortrait);
        }

    }
});

var app = angular.module("App",[]).controller("subscribeListCtrl",function($scope,appService){

    $scope.subscribeList = appService.selectReservationByUser();
    $scope.checkSeat = function () {

        var sl = this.sl;


        var bean = {
            "info"      :   sl.info,
            "time"      :   sl.time,
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

        return  list.list;
    }

    return factory;
});