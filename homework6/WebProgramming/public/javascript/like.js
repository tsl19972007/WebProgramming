$(function () {
    $(".like").click(function () {
        if($(this).hasClass('cs')){
            return;
        }
        $(this).addClass('cs');
        $(this).children('span.likes').html(function (index, value) {
            return ++value;
        });
        var pori=$(this).children("span.pori").html();
        var picture_id=$(this).children("span.picture_id").html();
        if(pori=='p') {
            $.ajax({
                url: "http://127.0.0.1:8000/like/picture",
                type: 'post',
                data: {'pictureId': picture_id},
                dataType: 'json',
                async: true,
                success: function (data) {
                    console.log(data)
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }else{
            $.ajax({
                url: "http://127.0.0.1:8000/like/imageBox",
                type: 'post',
                data: {'boxId': picture_id},
                dataType: 'json',
                async: true,
                success: function (data) {
                    console.log(data)
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    })
});