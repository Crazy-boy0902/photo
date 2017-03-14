//->音频的自动播放
//var banner = document.getElementById('banner');
var bannerInner = utils.getElesByClass('bannerInner',banner)[0];
var imgs = bannerInner.getElementsByTagName('img');
var focusList = utils.getElesByClass('focusList',banner)[0];
var lis = focusList.getElementsByTagName('li');
var leftBtn = utils.getElesByClass('left',banner)[0];
var rightBtn = utils.getElesByClass('right',banner)[0];
//获取数据
;(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open("get","data.txt?_="+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
            window.data = utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
})();
console.log(data);
//绑定数据
;(function bindData(){
    if(window.data){
        var str = ""; //拼接所有图片
        var liStr = "";
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            str += '<div><img src="" realSrc="' + curData.src + '" /></div>';
            liStr +=  i == 0 ? '<li class="selected"></li>'  :  '<li></li>';
        }
        str += '<div><img src="" realSrc="' + data[0].src + '" /></div>';
        utils.css(bannerInner,'width',(data.length+1)*1000);
        bannerInner.innerHTML = str;
        focusList.innerHTML = liStr;
    }
})();

//图片延迟加载
function imgsDelayLoad(){
    for(var i=0;i<imgs.length;i++){
        if(i==1){
            utils.css(imgs[i].parentNode,'zIndex',1);
            animate(imgs[i].parentNode,{opacity:1},300);
        }
        ;(function(i){
            var curImg=imgs[i];
            var tempImg= new Image();
            tempImg.src=curImg.getAttribute('realSrc');
            tempImg.onload=function(){
                curImg.src=this.src;
                utils.css(curImg,'display','block');
                animate(curImg,{opacity:1},300);
            }
            tempImg=null;
        })(i);
    }
}
window.setTimeout(imgsDelayLoad,300);

// 轮播图
var timer = window.setInterval(autoMove,1000);
var step = 0;
function autoMove(){
    if(step == data.length){ //data.length  4
        step = 0;
        utils.css(bannerInner,"left", -1000*step);
    }

    step++;
    animate(bannerInner,{left: -1000*step },500);
    focusAlign();
}
//焦点轮播
function focusAlign(){
    var tempStep = step == data.length ? 0 : step;
    for(var i=0; i<lis.length; i++){
        lis[i].className =  i === tempStep ? 'selected' : "";
    }
}

//左右点击按钮切换
leftBtn.onclick=function(){
    step--;
    animate(bannerInner,{left:-1000*step},500);
    focusAlign();
};

//点击焦点切换
;(function bindEventForLis(){//给所有焦点绑定点击事件
    for(var i=0;i<lis.length;i++){
        lis[i].index=i;
        lis[i].onclick=function(){
            step=this.index;
            animate(bannerInner,{left:-1000*step},500);
            focusAlign();
        }
    }
})();
rightBtn.onclick=autoMove;
banner.onmouseover=function(){
    window.clearInterval(timer);
    leftBtn.style.display=rightBtn.style.display='block';
};
banner.onmouseout=function(){
    timer=window.setInterval(autoMove,1000);
    leftBtn.style.display=rightBtn.style.display='none';
};
var music = document.getElementById("music"),
    musicAudio = document.getElementById("musicAudio");
window.setTimeout(function () {
    musicAudio.play();//->让音频播放:浏览器开始下载资源文件,也就是让它播放到出声音还需要一段时间,只有发出声音后我们才会显示音乐的图标
    musicAudio.addEventListener("canplay", function () {
        //->canplay:音频文件已经可以播放了,但是不一定是所有资源都加载完成了,大部分是边播放边界
        music.style.display = "block";
        music.className = "music move";
    }, false);
}, 1000);
music.addEventListener("click", function () {
    //->当前是暂停状态我让其播放
    if (musicAudio.paused) {
        musicAudio.play();
        music.className = "music move";
        return;
    }
    //->当前是播放状态我让其暂停
    musicAudio.pause();
    music.className = "music";
}, false);