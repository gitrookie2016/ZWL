/**
 * Created by Lix on 2016-7-7.
 */

var SeatRandomApp = angular.module("App",[]);

SeatRandomApp.controller("SeatRandomCtrl",function($scope,SeatRandomService){

    var rsi = SeatRandomService.rsi;

    if(rsi.success){
        var rsiData = rsi.object;
    }

    $scope.optionalSpace = rsiData.buildingName + "-" + rsiData.classroomNum;
    $scope.optionalSeatNum = rsiData.seatNum;

});


SeatRandomApp.controller("seatsSubmitCtrl",function($scope,SeatRandomService){

    $scope.seatsSubmit = function(){
        var seatId = SeatRandomService.rsi.object.seatId;
        var userInfo = $.cookie("userInfo");
        userInfo = g.toJson(userInfo);
        var userInfoId = userInfo.userInfoId;

        var reservationBeginTime = SeatRandomService.reservationBeginTime ;
        var reservationEndTime = SeatRandomService.reservationEndTime ;

        var apire = Api.addReservation(userInfoId,seatId,reservationBeginTime,reservationEndTime,null);

        if(apire.success){
            window.location = "index.html";
        }
    }

    $scope.seatsRandom = function () {
        //$("body").html("asdfasdfasdf");//等待提示
        window.location = window.location.href;
    }

});


SeatRandomApp.directive("seats",function (SeatRandomService) {
    return {
        priority: 10,
        restrict: 'E',
        template: SeatRandomService.initSeatInfo(),
        replace: true
    };
});

SeatRandomApp.factory("SeatRandomService",function(){
    var factory = {};

    /**
     * 获取随机座位信息
     */
    factory.getRandomSeatInfo = function(){
        var subscribeDate = g.toJson($.cookie("subscribeDate"));
        factory.reservationBeginTime = subscribeDate.reservationBeginTime;
        factory.reservationEndTime = subscribeDate.reservationEndTime;
        return Api.addSeatByrandom(subscribeDate.LibraryVal,factory.reservationBeginTime,factory.reservationEndTime);

    }

    /**
     * 初始化座位列表
     * @returns {string}
     */
    factory.initSeatInfo = function(){

        factory.rsi = factory.getRandomSeatInfo();
        var rsi = factory.rsi;
        if(!rsi.success){
            alert(rsi.message);
            window.location = "subscribe.html";
        }

        var subscribeDate = $.cookie("subscribeDate");
        var SeatForm = g.toJson(subscribeDate);

        var seatNum = rsi.object.seatNum;

        var _html = "<div class=\"seat-wrap\" id=\"seat\" style='margin:50px 50px;transform:translateX("+g.getCountWidth(seatNum)+"px);'>";
        if(SeatForm){
            var SeatInfo = Api.SeatsInfo(rsi.object.classroomId,SeatForm.reservationBeginTime,SeatForm.reservationEndTime);
            if(SeatInfo.success){
                var Seats = SeatInfo.list;
                factory.Seats = Seats;
                factory.seatsNum =  Seats.length;
                factory.seatColumns =  Seats[0].seatColumns;
                factory.seatRows =  Seats[0].seatRows;

                var array = new Array(factory.seatColumns);

                for (var k = 0 ; k < array.length  ; k++){
                    var temp = {};
                    temp.num = k + 1;
                    array[k] = temp;
                }

                factory.tempArray = array;

                for(var a = 0 ; a < array.length ; a++ ){
                    _html += "<ul>";
                    for(var s = 0 ; s < Seats .length ; s++){
                        if(Seats[s].columnNum == array[a].num   ){
                            var state = Seats[s].state;
                            var stateClass;
                            switch (state){
                                case 0:stateClass = "unseat null";//过道
                                    break;
                                case 1 : stateClass = "";//可预约
                                    break;
                                case 2 : stateClass = "selected  boy-half"; //有预约
                                    break;
                                case 3 : stateClass = "unOptional boy-half-hold";//不可预约
                                    break;

                            }
                            if(seatNum == Seats[s].seatNum && state != 0){
                                stateClass = "active";
                            }

                            _html += "<LI class='"+stateClass+"' data='"+Seats[s].seatNum+" ' dataID="+Seats[s].seatId+"></LI>";
                        }
                    }
                    _html +="</ul>";
                }


            }
        }
        return _html + "</div>";

    }


    return factory;
});