/**
 * Created by Lix on 2016-7-5.
 */

/**
 * 预约座位
 */
var subscribeApp = angular.module("App",[]);


/**
 * 自习室
 */
subscribeApp.controller("CampusAndBuildingCtrl",function($scope,subscribeService){

    var nowTime = Api.getSystemTime();

    var date = new Date(nowTime);
    $("#start").html(date.getHours() + ":" +date.getMinutes() + ":00");

    $scope.subscribeList = subscribeService.Campuses();

    //$scope.studyLounge = subscribeService.Classroom();//默认查询第一个自习室

    $scope.V_change = function(V_change){
        subscribeService.first_Campus = V_change;
        $scope.studyLounge = subscribeService.Classroom();
    }

    $scope.sT_change = function(sT_change){
        console.log(sT_change);
    }

});

/**
 * 研修室
 */
subscribeApp.controller("ResearchAndStudiesCtrl",function ($scope,subscribeService) {
    var RR = subscribeService.BuildingResearchRoom();

    if(RR) {
        $scope.libraryList = RR;

        $scope.V_change = function (V_change) {
            subscribeService.first_BuildingResearch = V_change;
            $scope.ResearchRoom = subscribeService.ResearchRoom();
        }

        $scope.RR_change = function(arg){
            if(arg){
                var ResearchRoom = this.ResearchRoom;
                for(var r = 0 ; r < ResearchRoom.length ; r++){
                    if(ResearchRoom[r].id == arg){
                        subscribeService.selectedInfo = ResearchRoom[r];
                        /*
                         dayBeginTime: "08:00:00"
                         dayEndTime: "22:00:00"
                         floor: 2
                         id: 2
                         maxPeople: 5
                         minPeople: 1
                         name: "请输入 研修室名研修室4"
                         reservationDayNumber: 3*/
                    }
                }

            }

        }

        $scope.peopleChange = function(arg){
            subscribeService.peopleNum = arg;
        }

    }
})



subscribeApp.controller("subscribeDateCtrl",function($scope,subscribeService){
    $scope.subscribeDate = subscribeService.getDate();

    $scope.checkDate = function (arg) {
        subscribeService.checkDate(arg);
    }
});

subscribeApp.controller("ChooseSeatCtrl",function ($scope,subscribeService) {
    $scope.ChooseSeat = function (arg) {

        if(arg){
            var flag = arg;
            var ChooseSeatFlag = subscribeService.ChooseSeat(arg);
            if(ChooseSeatFlag){
                window.location = flag+".html";
            }
        }

    }
    
    $scope.RRChooseSeat = function () {

        window.location = "subscribeConfirm.html";
        // Api.addReservationResearch();
    }
})




subscribeApp.factory("subscribeService",function () {

    var factory = {};

    factory.first_Campus = "";
    factory.day = "";

    factory.Campuses = function(){
        var Campus_re = Api.selectCampusAndBuildingInfomation();

        if(Campus_re.success){
            var Campuses = Campus_re.list;

            factory.first_Campus = Campuses[0].buildingId;
            factory.Campus_list = Campus_re.list;
            return Campus_re.list;

        }
    }

    factory.Classroom = function(){
        if(factory.first_Campus){
            var SEC = Api.selectEachClassroom(factory.first_Campus,"2016-07-05 08:00:00","9999-08-05 08:00:00");
            if(SEC.success){
                var studyLounge = SEC.list;
               return studyLounge;
            }
        }
    }

    factory.BuildingResearchRoom = function(){
            var RR = Api.BuildingResearchRoom();
            if(RR.success){
                var lists = RR.lists;
                return lists;
            }
    }

    factory.ResearchRoom = function(){
        if(factory.first_BuildingResearch){
            var RR = Api.ResearchRoom(factory.first_BuildingResearch);
            if(RR.success){
                return RR.lists;
            }
        }
    }

    factory.getDate = function(){

        var dateArray = new Array();

        var subscribeDate = new Date();

        var weekday=new Array(7);
        weekday[0]="周日";
        weekday[1]="周一";
        weekday[2]="周二";
        weekday[3]="周三";
        weekday[4]="周四";
        weekday[5]="周五";
        weekday[6]="周六";

        var S_Day = subscribeDate.getDay();

        for(var d = 0 ; d < 5 ; d++){

            var D_Date =  subscribeDate.setDate( subscribeDate.getDate() + d);

            var date = new Date(D_Date);
            var dates = {};
            dates.active = d == 0 ? "active" : "";
            dates.Weekday = weekday[parseInt(S_Day+d) % 7];
            var Month = date.getMonth()+1  ;
            Month = Month.toString().length == 2 ? Month : "0"+ Month;
            var Day = date.getDate().toString();
            Day = Day.length == 2 ? Day : "0" + Day;
            dates.date = Month + "-" + Day;
            if(d == 0){
                factory.day = dates.date;
            }
            dateArray[d] = dates;
        }
        return dateArray;

    }

    /**
     * 选择日期
     * @param arg
     */
    factory.checkDate = function (arg) {

        var day_children = $(".day-pick").children().eq(arg);
        var day_span = day_children.find("span");
        factory.day = day_span.eq(1)[0].innerHTML;
        day_children.addClass("active").siblings().removeClass("active");
    }

    /**
     * 预约座位
     * @param arg
     * @returns {boolean}
     * @constructor
     */
    factory.ChooseSeat = function (arg) {
       if(arg != null && ( arg == "optionalSeat" || arg == "randomSeat")){
           var bean = {};
           var Day_year = new Date().getFullYear();

           bean.reservationBeginTime = Day_year + "-" + factory.day + " "+ $(".date #start")[0].innerHTML;
           bean.reservationEndTime = Day_year + "-" + factory.day + " "+ $(".date #end")[0].innerHTML;

           var Library = $("#LibraryName");
           var studyLounge = $("#studyLoungeName");

           var LibraryName = Library.text();
           var LibraryVal = Library.val();

           if(!LibraryName || !LibraryVal){
               factory.alertError("请选择图书馆！");
               return false;
           }

           var studyLoungeName = studyLounge.text();
           var studyLoungeVal = studyLounge.val();

           if(!studyLoungeName || !studyLoungeVal){
               factory.alertError("请选择自习室！");

               return false;
           }

           bean.LibraryVal = LibraryVal;
           bean.studyLoungeVal = studyLoungeVal;

           $.cookie("subscribeDate",JSON.stringify(bean), {  path: '/' });//预约的时间

           var spaceBean = {};

           spaceBean.LibraryName = LibraryName;
           spaceBean.studyLoungeName = studyLoungeName;

           $.cookie("subscribeSpace",JSON.stringify(spaceBean), {  path: '/' });//

           return true;

       }

    }

    /**
     * 弹框
     * @param msg
     */
    factory.alertError = function(msg){
        var op = $("#open-modal2 p");
        op.html(msg);
        op.css("color","red");
        window.location = "#open-modal2";
    }


    return factory;
});
