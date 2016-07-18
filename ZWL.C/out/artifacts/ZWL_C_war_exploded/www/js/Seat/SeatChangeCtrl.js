/**
 * Created by Lix on 2016-7-7.
 */

var SeatRandomApp = angular.module("App",[]);

SeatRandomApp.controller("SeatRandomCtrl",function($scope,SeatRandomService){

    var rsi = SeatRandomService.rsi;

    if(rsi) {
        $scope.optionalSpace = rsi.buildingName + "-" + rsi.classroomNum;
        $scope.optionalSeatNum = rsi.seatNum;
    }

});


SeatRandomApp.controller("seatsSubmitCtrl",function($scope,SeatRandomService){

    $scope.seatsSubmit = function(){
        var SeatDataID = $("#SeatDataID").val();

        var apire = Api.changeSeatBychoose(SeatRandomService.rsi.reservationId,SeatDataID);

        if(apire.success){
            $.cookie("muiFlag",2,{path:"/"});
            window.location = "index.html";
        }else{
            alert(apire.message);
        }
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
     * 初始化座位列表
     * @returns {string}
     */
    factory.initSeatInfo = function(){

        var checkSeatInfo = g.toJson($.cookie("changeSeatInfo"));

        factory.rsi = checkSeatInfo;
        if(!checkSeatInfo){
            window.location = "index.html";
        }

        var seatNum = checkSeatInfo.seatNum;

        var _html = "<div class=\"seat-wrap\" id=\"seat\" style='margin:50px 50px;transform:translateX("+g.getCountWidth(seatNum)+"px);'>";

        if(checkSeatInfo){
            var SeatInfo = Api.SeatsInfo(checkSeatInfo.classroomId,checkSeatInfo.sreservationBeginTime,checkSeatInfo.sreservationEndTime);
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
                                case 1 : stateClass = "seat_yes";//可预约
                                    break;
                                case 2 : stateClass = "seat_yes selected  boy-half"; //有预约
                                    break;
                                case 3 : stateClass = "seat_yes unOptional boy-half-hold";//不可预约
                                    break;

                            }
                            if(seatNum == Seats[s].seatNum && state != 0){
                                stateClass = " activeme";
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