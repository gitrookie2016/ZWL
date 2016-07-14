/**
 * Created by Lix on 2016-7-8.
 */

var recordApp = angular.module("App",[]);

recordApp.controller("recordCtrl",function ($scope) {

    var Reservation = selectReservation(1,1,100 );

    if(Reservation.success){
        $scope.recordList = Reservation.list;
    }


    var getout = selectReservation(2,1,1 );

    if(getout.success) {

        $scope.getout = getout.sumReservation;

    }

    $scope.zxs = function () {
        $("#zxs").addClass("c-b") .removeClass("c-gray");
        $("#yxs").addClass("c-gray") .removeClass("c-b");

        var Reservation = selectReservation(1,1,100 );

        if(Reservation.success){
            $scope.recordList = Reservation.list;
        }


        var getout = selectReservation(2,1,1 );

        if(getout.success) {

            $scope.getout = getout.sumReservation;

        }

    }

    $scope.yxs = function () {
        $("#zxs").addClass("c-gray") .removeClass("c-b");
        $("#yxs").addClass("c-b") .removeClass("c-gray");
        var RoomReservation = Api.selectRoomReservation(1,100);
        if(RoomReservation.success){

            $scope.recordList = RoomReservation.lists;

        }
    }

});

recordApp.factory("recordService",function () {


    
    return factory;
});

function selectReservation(state,nowPage,pageSize){

    state = state == null ? 1 : state;
    nowPage = nowPage == null ? 1 : nowPage;
    pageSize = pageSize == null ? 1 : pageSize;

    var Reservation = Api.selectReservation(state,nowPage,pageSize);

    return Reservation;
}

