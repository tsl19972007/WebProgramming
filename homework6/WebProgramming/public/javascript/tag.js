var tagList = document.querySelector('.tags-list');
tagList.addEventListener("click", toggleActive, false);
var tl = new TimelineMax();
var w = null;

document.getElementById('tag-submit').onclick=function(){
    var tagName=document.getElementById('tag-input').value;
    alert(tagName);
    document.getElementsByClassName('tags-list')[0].innerHTML+="<li class=\"tag\">"+tagName+"</li>";
};
document.getElementById('get-tag').onclick=function(){
    getSelectedTags();
};
function toggleActive(e) {

    if (e.target.classList.contains('tags-list')) return;

    w = e.target.clientWidth;

    tl.to(e.target, 0.15, {
        color: "rgba(255, 255, 255, 0)"
    })
        .to(e.target, 0.2, {
            scaleX: 0,
            ease: Power2.easeIn
        })
        .to(e.target, 0.2, {
            width: 0,
            ease: Power2.easeIn,
            onComplete: function() {
                e.target.classList.toggle('active');
            }
        })
        .to(e.target, 0.2, {
            width: w,
            ease: Power2.easeOut,
            onComplete: function() {
                e.target.style = '';
            }
        })
        .to(e.target, 0.2, {
            scaleX: 1,
            ease: Power3.easeOut
        })
        .to(e.target, 0.15, {
            color: "rgba(255, 255, 255, 0.9)",
            onComplete: function() {
                e.target.style = '';
            }
        });

}
function getSelectedTags(){
    var tagList = document.getElementsByClassName("tag active");
    var tagNames=[];
    for(var i=0;i<tagList.length;i++){
        tagNames.push(tagList[i].innerHTML);
    }
    return tagNames;
}
