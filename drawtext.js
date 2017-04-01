var w = window.innerWidth ;
var h = window.innerHeight ;
canvas.width = w ;
canvas.height = h ;

canvas.style.left = '0';
canvas.style.top = '0';
var panel = new CanvasDraw(canvas) ;
var pers = 100 ;
var text ;
var dots ;
var imgData ;
// 构造点对象
var Dot = function(x,y,z,r){
    this.dx = x ;
    this.dy = y ;
    this.dz = z ;
    this.tx = rn(-w,w);
    this.ty = rn(-h,h);
    // 设置从-250到1000的随机透视
    this.tz = rn(-1*pers,1*pers);
    this.x = this.tx ;
    this.y = this.ty ;
    this.z = this.tz ;
    this.r = r ;
}

Dot.prototype = {
    paint : function(){
        var scale = pers/(pers + this.z);
        var x = parseInt(Math.abs(w/2+(this.x-w/2)*scale));
        var y = parseInt(Math.abs(h/2+(this.y-h/2)*scale));
        var r = this.r*scale;
        var o = scale*0.5;
        panel.drawBall(x,y,r,'rgba(180,180,180,1)')
    }
}

// 获取imgdata
function getImadata(text){
    var fontSize = w/3>150 ? 150 : w/3;
    panel.clear();
    panel.drawText( text , w/2 , h/2 , fontSize+'px impact' , 'center' ) ;
    var imgData = panel.cxt.getImageData(0,0,w,h)
    panel.clear();
    return imgData
}
// 构造点
function getDots(imgData){
    var dots = []
    for( var x = 0 ; x < imgData.width ; x += 6 ){
        for( var y = 0 ; y < imgData.height ; y += 6 ){
            var i = (y*imgData.width+x)*4-1;
            if(imgData.data[i]>=128) dots.push(new Dot(x,y,0,3));
        }
    }
    return dots
}
function initAnimate(dots,callback){
    // 初始化时间，开始动画
    var t = 0 ;
    var d = 100 ;
    // 开启运动模式 并进行运动
    window.animationStatus = 'animate';
    animate();
    function animate(){
        t++;
        render();
        // 监听运动状态是否为animate
        if(window.animationStatus === 'animate'){
            if(t<d){
                window.requestAnimationFrame(animate);
            }else{
                window.pauseAnimaionStatus = 'unknow';
                window.animationStatus = 'over';
                callback && callback()
            }
        }
    }
    function render(){
        panel.clear();
        dots.forEach(function(item){
            item.x = Tween.Bounce.easeOut(t,item.tx,item.dx-item.tx,d);
            item.y = Tween.Bounce.easeOut(t,item.ty,item.dy-item.ty,d);
            item.z = Tween.Bounce.easeOut(t,item.tz,item.dz-item.tz,d);
            item.paint();
        })
    }
}
function leaveAnimate(dots,callback){
    var t = 0 ;
    var d = 100 ;
    window.animationStatus = 'leave';
    animate();
    function animate(){
        t++;
        window.animationStatus = 'leave' && render()
        if(t<d){
            window.requestAnimationFrame(animate);
        }else{
            callback && callback()
        }
    }
    function render(){
        panel.clear();
        dots.forEach(function(item){
            item.x = Tween.Quint.easeOut(t,item.dx,item.tx-item.dx,d);
            item.y = Tween.Quint.easeOut(t,item.dy,item.ty-item.dy,d);
            item.z = Tween.Quint.easeOut(t,item.dz,item.tz-item.dz,d);
            item.paint();
        })
    }
}
window.onload = function(){
    var text = 'HELLO';
    var imgData = getImadata(text);
    var dots = getDots(imgData);
    initAnimate(dots);
}
document.querySelector('#draw').addEventListener('click',function(){
    text = document.querySelector('input').value;
    imgData = getImadata(text);
    dots = getDots(imgData);
    leaveAnimate(dots,function(){
        initAnimate(dots)
    })
})
document.querySelector('#pause').addEventListener('click',function(){
    // 如果不是over
    if(window.animationStatus === 'over'){
        return 
    }else if(window.animationStatus === 'stop'){
        leaveAnimate(dots,function(){
            initAnimate(dots)
        })
    }else{
        window.animationStatus = 'stop';
    }
})



