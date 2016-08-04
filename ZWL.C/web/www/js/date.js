$(function(){
	var _this = null;
	$(".pickdate").click(function(){

		_this = $(this);
		$(".pick-time h2").text(_this.attr("name"));
		$(".hour").find("span").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			$("#hour").html($(this).html())
		})
		$(".minute").children().click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			$("#min").html($(this).html())
		})

	})
	$("#confirm").click(function(){
		var hour = $("#hour").text().toString();
		hour = hour.length < 2 ? "0" +hour :hour
		var _url = window.location.href;
		if(_url.indexOf("sweepCode") > -1 || _url.indexOf("contract") > -1){
			var _this_text = _this.text();
			_this.text(_this_text.substring(0,11)+" "+hour +":"+$("#min").text()+":00");
		}else{
			_this.text(hour +":"+$("#min").text()+":00");
		}
		_this = null;
	})
})