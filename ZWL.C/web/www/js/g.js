
/**
 * Created by Lix on 2016-7-1.
 */

/**
 * IE兼容consol
 * @author lixiang
 */

window.console = window.console || (function(){
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir =  c.peofile = c.clear = c.exception = c.trace = c.assert =  function(){};
    return c;
})();



window["g"] = {};

/**
 * 获取路径后面的参数
 */
window["g"]["getUrlParam"] = function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 *
 */
window["g"]["ContextPath"] = "http://123.57.222.123:9901/";

/**
 * json字符串转成json对象
 * @author Lix
 */
window['g']['toJson'] = function toJson(arg){
    return eval('(' + arg + ')');
};

window["g"]["userInfo"] = function () {
    var _userInfo =   $.cookie("userInfo");
    if(typeof _userInfo == "undefined") {
        console.log("没有登录信息");
        window.location = "login.html";//判断登录跳转
    }else {
        return g.toJson(_userInfo);
    }
}

$(document).ready(function(){

    var appFooter = $(".app-footer");
    var a,b,c,d;
    if(appFooter.length > 0){
        var wlUrl = window.location.href;

        if(wlUrl.indexOf("index.html") > -1){
            a = "active"
        }
        if(wlUrl.indexOf("subscribe.html") > -1){
            b = "active"
        }
        if(wlUrl.indexOf("record.html") > -1){
            c = "active"
        }
        if(wlUrl.indexOf("settings.html") > -1){
            d = "active"
        }


    }

    var footerHtml = "<div class=\"nav row\">";
    footerHtml += "<a class=\"col "+a+"\" href=\"index.html\">首页</a>";
    footerHtml += "<a class=\"col "+b+"\" href=\"subscribe.html\">预约</a>";
    footerHtml += "<a class=\"col "+c+"\" href=\"record.html\">记录</a>";
    footerHtml += "<a class=\"col "+d+"\" href=\"settings.html\">设置</a>";
    footerHtml += "</div>";
    appFooter.html(footerHtml);

});


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));


document.write("<script src=\"../www/js/Api.js\" charset=\"utf-8\"></script>")
