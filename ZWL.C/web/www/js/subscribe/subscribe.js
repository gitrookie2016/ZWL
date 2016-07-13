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

    //起始时间为当前时间
    var nowTime = Api.getSystemTime();
    var date = new Date(nowTime);
    var Minutes = date.getMinutes().toString();
    Minutes = Minutes.length > 1 ? Minutes : "0"+Minutes;
    $("#start").html(date.getHours() + ":" + Minutes  + ":00");

    //自习室  图书馆
    $scope.subscribeList = subscribeService.Campuses();

    //$scope.studyLounge = subscribeService.Classroom();//默认查询第一个自习室

    //自习室  图书馆
    $scope.V_change = function(V_change){
        subscribeService.first_Campus = V_change;
        $scope.studyLounge = subscribeService.Classroom();
    }

    //自习室
    $scope.sT_change = function(sT_change){
        console.log(sT_change);
    }

    //研修室 init
    var RR = subscribeService.BuildingResearchRoom();
    subscribeService.rr_bean = {};
    if(RR) {
        //研修室 图书馆
        $scope.libraryList = RR;

        //研修室 图书馆 事件
        $scope.buildingId_change = function (V_change) {
            subscribeService.first_BuildingResearch = V_change;

            $scope.ResearchRoom = subscribeService.ResearchRoom();
        }

        //研修室 研修室 事件
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
                subscribeService.y_day =  subscribeService.selectedInfo.reservationDayNumber;
                //根据研修室 更新日期
                $scope.subscribeDate = subscribeService.getDate();

                var tipsfather = $(".tipsfather");
                tipsfather.show();

                var selectedInfo = subscribeService.selectedInfo;

                tipsfather.html("<p class='tips' >" + selectedInfo.minPeople +"人以上才可以预约该教室，最多可容纳" + selectedInfo.maxPeople + "人！</p> <br><p class='tips'>开放时间为：" + selectedInfo.dayBeginTime + "-" + selectedInfo.dayEndTime + "</p>");
            }
            subscribeService.rr_bean.roomed = arg;

        }

        $scope.peopleChange = function(arg){
            subscribeService.rr_bean.totalPeople = arg;
            subscribeService.peopleNum = arg;
        }


    }
    $scope.radioClick = function (arg) {
        $(".tipsfather").hide();


        if(arg == 0){
            subscribeService.y_day = 2;
            $("#studyLoungeName").text("");
            $scope.studyLounge = subscribeService.Classroom();

        }else{

            subscribeService.y_day = 1;

        }
        $scope.subscribeDate = subscribeService.getDate();

    }
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

        subscribeService.rr_bean.reservationDate = new Date().getFullYear() + "-" + subscribeService.day ;
        subscribeService.rr_bean.beginTime = $(".date #start")[0].innerHTML;
        subscribeService.rr_bean.endTime = $(".date #end")[0].innerHTML;

        var LibraryName = $("#LibraryName").text();
        subscribeService.rr_bean.LibraryName = LibraryName;
        var roomed = subscribeService.rr_bean.roomed;

        var si = subscribeService.selectedInfo;

        subscribeService.rr_bean.roomedName = si.name;

        if(!roomed){
            subscribeService.alertError("请选择研修室！");
            return false;
        }

        var totalPeople = subscribeService.rr_bean.totalPeople;
        if(!totalPeople){
            subscribeService.alertError("请填写预约总人数！");
            return false;
        }

        if(parseInt(totalPeople) > parseInt(si.maxPeople)){
            subscribeService.alertError("预约总人数超过研修室规定人数！<br> <h3>最大人数不能超过"+subscribeService.selectedInfo.maxPeople +"人</h3>");
            return false;
        }
        var dayBeginTime = new Date(subscribeService.rr_bean.reservationDate + " " +si.dayBeginTime);//
        var beginTime = new Date(subscribeService.rr_bean.reservationDate + " " +subscribeService.rr_bean.beginTime);

        if(beginTime < dayBeginTime){
            subscribeService.alertError("预约时间不在研修室开放时间内<br> <h3>研修室开放时间为："+si.dayBeginTime +"-"+si.dayEndTime+"</h3>");
            return false;
        }
        subscribeService.rr_bean.type = "researchRoom";

        $.cookie("subscribeSubmit",JSON.stringify(subscribeService.rr_bean), {  path: '/' });
        //window.location = "subscribeConfirm.html";
        var serviceArg = subscribeService.rr_bean;
        var apire = Api.addReservationResearch(serviceArg.roomed,serviceArg.totalPeople,serviceArg.reservationDate,serviceArg.beginTime,serviceArg.endTime);//roomed,totalPeople,reservationDate,beginTime,endTime
        if(apire.success){

            window.location = "index.html";

        }

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

        var y_day = factory.y_day;

        y_day = y_day ? y_day : 2;

        for(var d = 0 ; d < y_day ; d++){

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
