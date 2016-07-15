/**
 * Created by Lix on 2016-7-7.
 */

var SeatApp = angular.module("App",[]);

SeatApp.controller("SeatCtrl",function($scope,SeatService){

    $scope.optionalSpace = SeatService.initSpace();


});


SeatApp.controller("seatsSubmitCtrl",function($scope,SeatService){
    $scope.seatsSubmit = function(){
        var seatId = $("#SeatDataID").val();
        var seatNum = $("#seatId").text();
        var userInfo = $.cookie("userInfo");
        userInfo = g.toJson(userInfo);
        var userInfoId = userInfo.userInfoId;

        var reservationBeginTime = SeatService.reservationBeginTime ;
        var reservationEndTime = SeatService.reservationEndTime ;

        var srs = {};
        srs.seatId = seatId;
        srs.seatNum = seatNum;
        srs.reservationBeginTime = reservationBeginTime;
        srs.reservationEndTime = reservationEndTime;
        srs.userInfoId = userInfoId;
        srs.type = "os";

        $.cookie("SubmitInfo",JSON.stringify(srs),{path : "/"});

        window.location = "subscribeConfirm.html";

    }

});


SeatApp.directive("seats",function (SeatService) {
    return {
        restrict: 'E',
        template: SeatService.initSeatInfo(),
        replace: true
    };
});

SeatApp.factory("SeatService",function(){
    var factory = {};

    factory.initSpace = function(){
        var subscribeSpace =  $.cookie("subscribeSpace");
        var Space = g.toJson(subscribeSpace);
        return Space.LibraryName + "-" + Space.studyLoungeName;
    }

    factory.initSeatInfo = function(){
        var subscribeDate = $.cookie("subscribeDate");
        var SeatForm = g.toJson(subscribeDate);

        factory.reservationBeginTime = SeatForm.reservationBeginTime;
        factory.reservationEndTime = SeatForm.reservationEndTime;

        var _html = "<div class=\"seat-wrap\" id=\"seat\">";
        if(SeatForm){
            var SeatInfo = Api.SeatsInfo(SeatForm.studyLoungeVal,SeatForm.reservationBeginTime,SeatForm.reservationEndTime);
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
                            switch (state){
                                case 0:state = "unseat null";//过道
                                    break;
                                case 1 : state = "seat_yes";//可预约
                                    break;
                                case 2 : state = "seat_yes selected  boy-half"; //有预约
                                    break;
                                case 3 : state = "seat_yes unOptional boy-half-hold";//不可预约
                                    break;

                            }

                            _html += "<LI class='"+state+"' data='"+Seats[s].seatNum+" ' dataID="+Seats[s].seatId+"></LI>";
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