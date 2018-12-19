var OL_Action_Root = "http://127.0.0.1:8000";

window.onload=function(){
    var input = document.getElementById("img_input");
    input.addEventListener('change', previewFile, false);
    // 将所有点击的标题和要显示隐藏的列表取出来
    var ps = document.getElementsByClassName("section");
    var panels = document.getElementsByClassName("panel");

    // 遍历所有要点击的标题且给它们添加索引及绑定事件
    for(var i = 0, n = ps.length; i <n; i += 1){

        ps[i].id = i;
        ps[i].onclick = function(){
            for(var j = 0; j < n ; j += 1){
                panels[j].style.display = "none";
                ps[j].lastElementChild.className="fa fa-chevron-right fa-2x";
            }
            panels[this.id].style.display = "block";
            ps[this.id].lastElementChild.className="fa fa-chevron-down fa-2x";
        }
        // 获取点击的标题上的索引属性，根据该索引找到对应的列表
    }
    // 判断该列表，如果是显示的则将其隐藏，如果是隐藏的则将其显示出来

    $("#btn_upload").on("click", function() {
        if (start_Edit===false) {
            return false;
        } else {
            var cas = $('#image').cropper('getCroppedCanvas');// 获取被裁剪后的canvas
            var base64 = cas.toDataURL('image/png'); // 转换为base64
            var remark=document.getElementById('picture_remark').value;
            uploadFile(base64,remark)//编码后上传服务器
        }
    });

    var rotate=document.getElementsByName("rotate")[0];
    var brightness=document.getElementsByName("brightness")[0];
    var contrast=document.getElementsByName("contrast")[0];
    var saturation=document.getElementsByName("saturation")[0];
    var ie = !!window.ActiveXObject;
    var moveup=document.getElementById("move-up");
    var movedown=document.getElementById("move-down");
    var moveleft=document.getElementById("move-left");
    var moveright=document.getElementById("move-right");
    var enlarge=document.getElementById("enlarge");
    var narrow=document.getElementById("narrow");
    var reversex=document.getElementById("reverse-x");
    var reversey=document.getElementById("reverse-y");
    var crop_width=document.getElementById('crop-width');
    var crop_height=document.getElementById('crop-height');
    if(ie){
        rotate.onpropertychange=function(e){
            var newDegree=e.target.value;
            $('#image').cropper('rotate',newDegree-degree);
            degree=newDegree;
        };
        brightness.onpropertychange=function(e){
            brightVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "brightness("+brightVal+")");
            $('img').css("filter", "brightness("+brightVal+")");
        };
        contrast.onpropertychange=function(e){
            contrastVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "contrast("+contrastVal+")");
            $('img').css("filter", "contrast("+contrastVal+")");
        };
        saturation.onpropertychange=function(e){
            saturateVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "saturate("+saturateVal+")");
            $('img').css("filter", "saturate("+saturateVal+")");
        };
    }else{
        rotate.oninput=function(e){
            var newDegree=e.target.value;
            $('#image').cropper('rotate',newDegree-degree);
            degree=newDegree;
        };
        brightness.oninput=function(e){
            brightVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "brightness("+brightVal+")");
            $('img').css("filter","brightness("+brightVal+")");
        };
        contrast.oninput=function(e){
            contrastVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "contrast("+contrastVal+")");
            $('img').css("filter", "contrast("+contrastVal+")");
        };
        saturation.oninput=function(e){
            saturateVal=e.target.value/5.0;
            $('img').css("-webkit-filter", "saturate("+saturateVal+")");
            $('img').css("filter", "saturate("+saturateVal+")");
        };
    }
    moveup.onclick=function(e){
        $('#image').cropper('move', 0, -1);
    };
    movedown.onclick=function(e){
        $('#image').cropper('move', 0, 1);
    };
    moveleft.onclick=function(e){
        $('#image').cropper('move', -1, 0);
    };
    moveright.onclick=function(e){
        $('#image').cropper('move', 1, 0);
    };
    enlarge.onclick=function(e){
        $('#image').cropper('zoom', 0.1);
    };
    narrow.onclick=function(e){
        $('#image').cropper('zoom', -0.1);
    };
    reversex.onclick=function(e){
        if(reversedX) {
            $('#image').cropper('scale', 1, 1);
            reversedX = false;
        }
        else{
            $('#image').cropper('scale', -1, 1);
            reversedX = true;
        }
    };
    reversey.onclick=function(e){
        if(reversedY) {
            $('#image').cropper('scale', 1, 1);
            reversedY=false;
        }else{
            $('#image').cropper('scale', 1, -1);
            reversedY=true;
        }
    };
    crop_width.onchange=function(e){
        var width=document.getElementById('crop-width').value;
        var height=document.getElementById('crop-height').value;
        $('#image').cropper('setAspectRatio',width/height);
    };
    crop_height.onchange=function(e){
        var width=document.getElementById('crop-width').value;
        var height=document.getElementById('crop-height').value;
        $('#image').cropper('setAspectRatio',width/height);
    };
};
//ajax请求上传
function uploadFile(file,remark) {
    $.ajax({
        url: OL_Action_Root+"/upload",
        type : 'post',
        data:{'imgData': file, 'remark':remark},
        dataType: 'json',
        async : true,
        success : function(data) {
            console.log(data)
        },
        error:function(e){
            console.log(e);
        }
    });
}
function previewFile() {
    $('#image').cropper('destroy');
    var file = this.files[0];
    if (!/image\/\w+/.test(file.type)) {
        alert("image only please.");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var img = new Image,
            quality = 0.8, //image quality
            canvas = document.createElement("canvas");
            drawer = canvas.getContext("2d");
        img.src = this.result;
        img.onload = function() {
            canvas.width = 800;
            canvas.height = 600;
            drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL("image/jpg", quality);
        };
        document.getElementById('image').src=img.src;
        startEdit();
    };
}
function startEdit() {
    start_Edit=true;
    $('#image').cropper({
        aspectRatio: 16 / 9,
        viewMode: 1,
        dragMode: 'none',
        preview: ".small",
        responsive: false,
        movable: true,
        restore: false,
        //        modal:false,
        //        guides:false,
        //        background:false,
        autoCrop: false,
        //        autoCropArea:0.1,
        //        movable:false,
        //        scalable:false,
        //        zoomable:false,
        //        wheelZoomRatio:false,
        //        cropBoxMovable:false,
        //        cropBoxResizable:false,
        ready: function () {
            console.log("ready");
            console.log(this);
            $(this).cropper('crop');
        },
        cropstart: function (e) {
            console.log(e);
            console.log("cropstart");
        },
        cropmove: function (e) {
            cropData = $('#image').cropper('getCropBoxData');
            document.getElementById('crop-width').value = cropData.width.toFixed(2);
            document.getElementById('crop-height').value = cropData.height.toFixed(2);
        },
        cropend: function (e) {
            console.log("cropend");
        },
        crop: function (e) {
            console.log("crop");
        },
        zoom: function (e) {
            console.log("zoom");
        },
    });
}