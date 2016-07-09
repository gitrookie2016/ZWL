/**
 * Created by Lix on 2016-7-8.
 */

var recordApp = angular.module("App",[]);

recordApp.controller("recordCtrl",function ($scope) {
    $scope.recordList = selectReservation(null,1,25 );
    
});

recordApp.factory("recordService",function () {
    var factory = {};
    

    
    return factory;
});

function selectReservation(state,nowPage,pageSize){

    state = state == null ? 1 : state;
    nowPage = nowPage == null ? 1 : nowPage;
    pageSize = pageSize == null ? 1 : pageSize;

    var Reservation = Api.selectReservation(state,nowPage,pageSize);

    return Reservation.list;
}

