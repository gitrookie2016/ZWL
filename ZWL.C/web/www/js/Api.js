/**
 * Created by Lix on 2016-7-1.
 */
window["Api"] = {};

/**
 * 查询学校
 * @returns {string}
 * @constructor
 */
window["Api"]["Schools"] = function(){
    var arg = "" ;

    $.ajax({
        type	:	"POST",

        url		:	g.ContextPath + "school/selectSchool",
        async	:	false,
        success	:	function(res){
            if(res){
               arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}


/**
 * 登录
 * @param userNum
 * @param userPwd
 * @param schoolNum
 * @returns {string}
 */
window["Api"]["login"] = function (userNum,userPwd,schoolNum){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "userNum":userNum,
            "userPwd":userPwd,
            "schoolNum":schoolNum
        },
        url		:	g.ContextPath + "userInfo/login",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}


/**
 * 查询校区和图书馆信息
 * @param userInfoId
 * @returns {string}
 */
window["Api"]["selectCampusAndBuildingInfomation"] = function (){
    var arg = "" ;

    var _ui = g.userInfo();

    $.ajax({
        type	:	"POST",
        data    :   {
            "userInfoId":_ui.userInfoId
        },
        url		:	g.ContextPath + "selectInfo/selectCampusAndBuildingInfomation",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

/**
 * 查询每间教室总座位数和剩余座位数
 * @param buildingId 楼房id
 * @param reservationBeginTime 起始时间
 * @param reservationEndTime  截止时间
 * @returns {string}
 */
window["Api"]["selectEachClassroom"] = function (buildingId,reservationBeginTime,reservationEndTime){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "buildingId":buildingId,
            "reservationBeginTime":reservationBeginTime,
            "reservationEndTime":reservationEndTime
        },
        url		:	g.ContextPath + "selectInfo/selectEachClassroom_TotalSeatsAndRemainSeats",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

/**
 * 查询包含研修室的图书馆列表
 * @param userId
 * @returns {string}
 */
window["Api"]["selectBuildingContainResearchRoom"] = function (token,userId){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "userId":userId
        },
        url		:	g.ContextPath + "selectInfo/selectBuildingContainResearchRoom",

       // Authorization:token,
        async	:	false,

        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

/**
 * 查询研修室信息（根据buildingId和userId得到满足权限的研修室）
 * @param buildingId
 * @param userId
 * @returns {string}
 */
window["Api"]["selectResearchRoom"] = function (buildingId,userId){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "userId":userId
        },
        url		:	g.ContextPath + "researchRoom/selectResearchRoom",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

/**
 * 预约研修室
 * @param userId
 * @param roomed
 * @param totalPeople
 * @param reservationDate
 * @param beginTime
 * @param endTime
 * @returns {string}
 */
/*window["Api"]["addReservation"] = function (userId,roomed,totalPeople,reservationDate,beginTime,endTime){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "userId":userId,
            "roomed":roomed,
            "totalPeople":totalPeople,
            "reservationDate":reservationDate,
            "beginTime":beginTime,
            "endTime":endTime
        },
        url		:	g.ContextPath + "researchRoom/addReservation",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}*/

/**
 * 查询某教室匹配的座位
 * @param classroomId
 * @param reservationBeginTime
 * @param reservationEndTime
 * @returns {string}
 * @constructor
 */
window["Api"]["SeatsInfo"] = function (classroomId,reservationBeginTime,reservationEndTime){
    var arg = "" ;

    $.ajax({
        type	:	"POST",
        data    :   {
            "classroomId":classroomId,
            "reservationBeginTime":reservationBeginTime,
            "reservationEndTime":reservationEndTime
        },
        url		:	g.ContextPath + "selectInfo /selectEachClassroom_SeatsInfo",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

/**
 * 预约（自己选座）
 * @param userInfoId
 * @param seatId
 * @param reservationBeginTime
 * @param reservationEndTime
 * @param notArrive
 * @returns {string}
 * @constructor
 * headers: {
            "Authorization":userInfo.token
        },
 */
window["Api"]["addReservation"] = function (userInfoId,seatId,reservationBeginTime,reservationEndTime,notArrive){
    var arg = "" ;
    notArrive = notArrive != null ? notArrive : "1";
    var seatId = $("#SeatDataID").val();
    var userInfo = g.userInfo();

    var Authorization = userInfo.token;
    var dataS = {
        "url":g.ContextPath + "reservation/addReservationBychoose",
        "userInfoId":userInfoId,
        "seatId":seatId,
        "reservationBeginTime":reservationBeginTime,
        "reservationEndTime":reservationEndTime,
        "notArrive":notArrive,
        "Authorization":Authorization
    };

    $.ajax({


        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,


        success	:	function(res){
            if(res){
                arg = res;
                console.log(arg);
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

/**
 * 查询该用户签到或未签到的预约记录和授权记录(首页)
 * @returns {string}
 */
window["Api"]["selectReservationByUser"] = function (){
    var arg = "" ;
    var userInfo = g.userInfo();
    var dataS = {
        "url":g.ContextPath + "reservation/selectReservationByUser",
        "userInfoId":userInfo.userInfoId,
        "Authorization":userInfo.token
    };

    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,


        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

/**
 * 查询该用户记录状态正常或异常的预约记录
 * @param state
 * @param nowPage
 * @param pageSize
 * @returns {string}
 */
window["Api"]["selectReservation"] = function (state,nowPage,pageSize){
    var arg = "" ;
    var userInfo = g.userInfo();
    var dataS = {
        "url":g.ContextPath + "reservation/selectReservation",
        "userInfoId":userInfo.userInfoId,
        "state":state,
        "nowPage":nowPage,
        "pageSize":pageSize,
        "Authorization":userInfo.token
    };

    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,


        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}


window["Api"]["cancelReservation"] = function (reservationId ){
    var arg = "" ;
    var userInfo = g.userInfo();
    var dataS = {
        "url":g.ContextPath + "reservation/cancelReservation",
        "reservationId":reservationId,
        "Authorization":userInfo.token
    };

    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,


        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

window["Api"]["password"] = function (oldPassword,newPassword){
    var arg = "" ;
    var userInfo = g.userInfo();
    $.ajax({
        type	:	"POST",
        data    :   {
            "userInfoId":userInfo.userInfoId,
            "oldPassword":oldPassword,
            "newPassword":newPassword
        },
        url		:	g.ContextPath + "userInfo/current/password",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}



//version/android
/**
 * 获取最新版本号和下载地址
 * @returns {string}
 */
window["Api"]["android"] = function (){
    var arg = "" ;
    $.ajax({
        type	:	"POST",
        url		:	g.ContextPath + "version/android",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

//version/ios
/**
 * 获取最新版本号和下载地址
 * @returns {string}
 */
window["Api"]["ios"] = function (){
    var arg = "" ;
    $.ajax({
        type	:	"POST",
        url		:	g.ContextPath + "version/ios",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }
    });

    return arg;
}

/**
 * 查询包含研修室的图书馆列表
 * @returns {string}
 * @constructor
 */
window["Api"]["BuildingResearchRoom"] = function (){
    var arg = "" ;
    var userInfo = g.userInfo();
    var dataS = {
        "url":g.ContextPath + "selectInfo/selectBuildingContainResearchRoom",
        "userId":userInfo.userInfoId,
        "Authorization":userInfo.token
    };

    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,


        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

/**
 * 查询研修室信息（根据buildingId和userId得到满足权限的研修室）
 * @param buildingId
 * @returns {string}
 * @constructor
 */
window["Api"]["ResearchRoom"] = function (buildingId){
    var arg = "" ;
    var userInfo = g.userInfo();
    var dataS = {
        "url":g.ContextPath + "researchRoom/selectResearchRoom",
        "buildingId":buildingId,
        "userId":userInfo.userInfoId,
        "Authorization":userInfo.token
    };
    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

/**
 * 预约研修室
 * @param roomed
 * @param totalPeople
 * @param reservationDate
 * @param beginTime
 * @param endTime
 * @returns {string}
 */
window["Api"]["addReservationResearch"] = function (roomed,totalPeople,reservationDate,beginTime,endTime){
    var arg = "" ;
    var userInfo = g.userInfo();

    var dataS = {
        "url":g.ContextPath + "researchRoomReservation/addReservation",
        "userId":userInfo.userInfoId,
        "roomId":roomed,
        "totalPeople":totalPeople,
        "reservationDate":reservationDate,
        "beginTime":beginTime,
        "endTime":endTime,
        "Authorization":userInfo.token
    };
    $.ajax({

        type: "post",
        url		:	 "../WebService.do",
        async	:	false,
        dataType : "json",
        data    : {
            "data" : JSON.stringify(dataS)
        } ,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}

//getTime/getSystemTime

window["Api"]["getSystemTime"] = function(){
    var arg = "" ;
    $.ajax({
        type: "get",
        url		:	 g.ContextPath + "getTime/getSystemTime",
        async	:	false,
        success	:	function(res){
            if(res){
                arg = res;
            }
        },
        error:function(e) {
            console.log(e);
            return;
        }

    });

    return arg;
}