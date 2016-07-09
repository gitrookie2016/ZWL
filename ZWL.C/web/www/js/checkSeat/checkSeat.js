/**
 * Created by Lix on 2016-7-9.
 */
//checkSeatCtrl

var checkSeatApp = angular.module("App",[]);

checkSeatApp.controller("checkSeatCtrl",function ($scope) {

    var checkSeatInfo = g.toJson($.cookie("checkSeatInfo"));

    if(typeof checkSeatInfo == "undefined"){
        window.location = history.go(-1);
    }
    $scope.info = checkSeatInfo.info;
    $scope.time = checkSeatInfo.time;
    $scope.seatNum = checkSeatInfo.seatNum;

});