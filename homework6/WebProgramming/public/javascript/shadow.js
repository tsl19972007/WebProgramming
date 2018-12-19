$(function(){

    //从底部上升的遮罩效果开始
    $(".con").hover(function(){
        $(this).find(".txt1").stop().animate({height:"198px"},200);
        $(this).find(".txt1 h3").stop().animate({paddingTop:"60px"},200);
        $(this).find(".txt1 p").css("display","block");
    },function(){
        $(this).find(".txt1").stop().animate({height:"0"},200);
        $(this).find(".txt1 h3").stop().animate({paddingTop:"0px"},200);
        $(this).find(".txt1 p").css("display","none");
    });
    //从底部上升的遮罩效果结束
});