/**
 * Created by Lix on 2016-7-8.
 */
var moreData = {};

var recordApp = angular.module("App",[]);

recordApp.controller("recordCtrl",function ($scope , recordService) {


    $scope.recordList = recordService.zxs();

    var getout = selectReservation(2,1,1 );

    if(getout.success) {

        $scope.getout = getout.sumReservation;

    }

    $scope.zxs = function () {
        $("#zxs").addClass("c-b") .removeClass("c-gray");
        $("#yxs").addClass("c-gray") .removeClass("c-b");
        $(".temp").remove();
        mui('#pullRefresh').pullRefresh().scrollTo(0,0,100);
        mui('#pullRefresh').pullRefresh().refresh(true);
        $scope.recordList = recordService.zxs();


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
            $(".temp").remove();
            mui('#pullRefresh').pullRefresh().scrollTo(0,0,100);
            mui('#pullRefresh').pullRefresh().refresh(true);
            $scope.recordList = RoomReservation.lists;

        }
    }

});

recordApp.factory("recordService",function () {

    var factory = {}

    factory.zxs = function () {
        var  pageSize = 10;
        var  pageNum = 1;
        var Reservation = selectReservation(1,pageNum,pageSize );

        if(Reservation.success){
            moreData.rvflag = true;
            moreData.rvfpageSize = pageSize;
            moreData.rvfpageNum = pageNum;
            moreData.rvfpageCount = Reservation.sumReservation;

            return Reservation.list;
        }
    };

    return factory;

});



function selectReservation(state,nowPage,pageSize){

    state = state == null ? 1 : state;
    nowPage = nowPage == null ? 1 : nowPage;
    pageSize = pageSize == null ? 1 : pageSize;

    var Reservation = Api.selectReservation(state,nowPage,pageSize);

    return Reservation;
}

