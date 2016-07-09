/**
 * Created by Lix on 2016-7-1.
 */
/**
 * login
 */

$(document).ready(function(){

    var _schools = Api.Schools();
    if(_schools){
        g_schoolInit(_schools);
    }
    $(".g-login").click(function(){
        var _userNum = $(".userNum").val();
        var _userPwd = $(".userPwd").val();
        var _schoolNum = $(".schoolNum option:selected").val();
        if(_userNum && _userPwd && _schoolNum){

           var _userInfo = Api.login(_userNum,_userPwd,_schoolNum);

            if(_userInfo.success){
                //_userInfo.object
                var bean = {};
                bean.token = _userInfo.object.token;
                bean.userSex = _userInfo.object.userSex;
                bean.userName = _userInfo.object.userName;
                bean.schoolName = _userInfo.object.schoolName;
                bean.schoolNum = _userInfo.object.schoolNum;
                bean.campusName = _userInfo.object.campusName;
                bean.credential = _userInfo.object.credential;
                bean.userInfoId = _userInfo.object.userInfoId;
                bean.campusId = _userInfo.object.campusId;
                bean.userNum = _userInfo.object.userNum;
                bean.major = _userInfo.object.major;
                bean.headPortrait = _userInfo.object.headPortrait;
                $.cookie("userInfo",JSON.stringify(bean), {  path: '/' });
                window.location="index.html";

            }
        }
        //$('#testSelect option:selected') .val();
    });


});

/**
 * 学校
 * @param arg
 */
function g_schoolInit(arg){
    if(arg){

        if(arg.success){
            var g_schools = $(".g-schools");
            if(g_schools.length > 0){
                var lists = arg.lists;
                for(var a = 0 ; a < lists.length ; a++){
                    g_schools.append("<option value=\""+lists[a].schoolNum+"\"> "+lists[a].name+"</option>")
                }
            }
        }
    }
}

