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
		_this.text($("#hour").text()+":"+$("#min").text()+":00");
		_this = null;
	})
})