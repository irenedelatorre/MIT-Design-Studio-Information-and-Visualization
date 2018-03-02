// find the canvas element by using id
var canvas1 = document.getElementById("plot1");

// get dimensions of canvas 1
// retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and then scale back to normal in CSS
// this is not necessary
canvas1.width = 2 * document.getElementById("plot1").clientWidth;
canvas1.height = 2 * document.getElementById("plot1").clientHeight;
var canvas1RealWidth = document.getElementById("plot1").clientWidth;
var canvas1RealHeight = document.getElementById("plot1").clientHeight;

// if you want to avoid this step
// canvas1.width = document.getElementById("plot1").clientWidth;
// canvas1.height = document.getElementById("plot1").clientHeight;
// canvas1RealWidth = canvas1.width
// canvas1RealHeight = canvas1.Height

// create a drawing object (getContext)
var ctx1 = canvas1.getContext("2d");

// code to request the reload of the window --> we will use this to create animations
var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();

// SKETCH 1
// center of the plot will be the center of our clock
var centerX = canvas1.width / 2;
var centerY = canvas1.height / 2;

//translate the center of the clock to the center of the plot
ctx1.translate(centerX, centerY);

// draw canvas 1

// in order to animate the clock we need to call the function in intervals
// in this case we will call it every second (1000 milliseconds)
ctx1.scale(2,2);
setInterval(drawCanvas1, 1000);

function drawCanvas1() {
    //make the canvas a diff clor
    //ctx.rect(x,y,width,height);
    ctx1.beginPath();
    ctx1.fillStyle = "#1e1b6d"; 
    ctx1.rect(-canvas1RealWidth/2,-canvas1RealHeight/2,canvas1RealWidth,canvas1RealHeight);
    ctx1.fill();
    ctx1.closePath();

    
    // outer radius of the clock
    var radiusC1 = 0.78 * (canvas1RealWidth / 2);
    var radiusC2 = 0.6 * (canvas1RealWidth / 2);
    var radiusC3 = 0.39 * (canvas1RealWidth / 2);
    
    // arc() draws arcs
    // it needs 5 inputs arc(x,y,radius,startAngle,endAngle)
    // to create circles the starting angle must be 0 and the end angle must be 2*Math.PI
    // because we have translated our canvas to the center; the center of the clock is 0,0
    var centerClock1X = canvas1RealWidth/11;
    var centerClock1Y = -canvas1RealHeight/3.7;
    
    var centerClock2X = -canvas1RealWidth/5.5;
    var centerClock2Y = canvas1RealHeight/7.8;
    
    var centerClock3X = canvas1RealWidth/4.3;
    var centerClock3Y = canvas1RealHeight/2.8;
    
    
    
    drawClock(centerClock1X, centerClock1Y, radiusC1);
    drawClock(centerClock2X, centerClock2Y, radiusC2);
    drawClock(centerClock3X, centerClock3Y, radiusC3);
    
    function drawClock(X, Y, radius){
        // start drawing
        ctx1.beginPath();

        // determine style of the form
        ctx1.strokeStyle = "#d4d4d4";
        ctx1.lineWidth = 5;
        ctx1.fillStyle = "#dd4d5d"; // to paint over the previous drawing

        ctx1.arc(X, Y, radius, 0, 2 * Math.PI);
    
        // stroke your drawing
        ctx1.stroke();
        ctx1.fill();

        //end drawing   
        ctx1.closePath();
    }
    
    drawNumbersHours(radiusC1, centerClock1X, centerClock1Y);
    drawNumbersMinutes(radiusC2, centerClock2X, centerClock2Y);
    
    drawNumbersSeconds(radiusC3, centerClock3X, centerClock3Y);

    function drawNumbersHours(radius, centerClockX, centerClockY) {
        var ang;
        var num;
        ctx1.font = radius*0.19 + "px avenir";
        ctx1.textBaseline="middle";
        ctx1.textAlign="center";
        ctx1.fillStyle = "#2ddbea";
        
        for(num= 1; num < 13; num++){
            if(num%3 ==0){
                ang = num * Math.PI / 6;
                ctx1.rotate(ang);
                ctx1.translate(0, -radius*0.81);
                ctx1.moveTo(centerClockX, centerClockY);
                ctx1.rotate(-ang);
                ctx1.fillText(num.toString(), centerClockX, centerClockY);
                ctx1.rotate(ang);
                ctx1.translate(0, radius*0.81);
                ctx1.rotate(-ang);
                ctx1.restore();    
            }
        }
    }
    
    function drawNumbersMinutes(radius, centerClockX, centerClockY) {
        var ang;
        var num;
        ctx1.font = radius*0.13 + "px avenir";
        ctx1.textBaseline="middle";
        ctx1.textAlign="center";
        ctx1.fillStyle = "#2ddbea";
        
        for(num= 1; num < 61; num++){
            if (num%10 == 0){
                 ang = num * Math.PI / 30;
                ctx1.rotate(ang);
                ctx1.translate(0, -radius*0.85);
                ctx1.moveTo(centerClockX, centerClockY);
                ctx1.rotate(-ang);
                ctx1.fillText(num.toString(), centerClockX, centerClockY);
                ctx1.rotate(ang);
                ctx1.translate(0, radius*0.85);
                ctx1.rotate(-ang);
                ctx1.restore();
            }
        }
    }
    
    function drawNumbersSeconds(radius, centerClockX, centerClockY) {
        var ang;
        var num;
        ctx1.font = radius*0.13 + "px avenir";
        ctx1.textBaseline="middle";
        ctx1.textAlign="center";
        ctx1.fillStyle = "#2ddbea";
        
        for(num= 1; num < 61; num++){
            if (num%5 == 0){
                 ang = num * Math.PI / 30;
                ctx1.rotate(ang);
                ctx1.translate(0, -radius*0.85);
                ctx1.moveTo(centerClockX, centerClockY);
                ctx1.rotate(-ang);
                ctx1.fillText(num.toString(), centerClockX, centerClockY);
                ctx1.rotate(ang);
                ctx1.translate(0, radius*0.85);
                ctx1.rotate(-ang);
                ctx1.restore();
            }
        }
    }

    
    // get current date and timing
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) + (minutes * Math.PI / (6 * 60)) + (seconds * Math.PI / (360 * 60));
    drawHand(hour, radiusC1 * 0.5, 6, "#000000");

    //minute
    minutes = (minutes * Math.PI / 30) + (seconds * Math.PI / (30 * 60));
    drawHand(minutes, radiusC2 * 0.8, 4, "#000000");
    
    // second
    seconds = (seconds * Math.PI / 60);
    drawHand(seconds, radiusC3 * 0.9, 1.5, "#ffffff");


    // the steps to draws the hands is the same for all of them
    // we can create a function, and then call it for each of the hands
    function drawHand(pos, length, width, color) {
    
        ctx1.beginPath();
        ctx1.lineWidth = width;
        ctx1.lineCap = "round";
        ctx1.strokeStyle = color;
        if( length == radiusC3 * 0.9) {
            //seconds hand 
            ctx1.moveTo(centerClock3X, centerClock3Y);
        }
        else if (length == radiusC2 * 0.8){
            //minutes hand
            ctx1.moveTo(centerClock2X, centerClock2Y);
        }
        else{
            ctx1.moveTo(centerClock1X, centerClock1Y);
        }
        
        ctx1.rotate(pos);
        
        
        if( length == radiusC3 * 0.9) {
            //seconds hand 
            ctx1.lineTo(centerClock3X, -centerClock3Y+length);
        }
        else if (length == radiusC2 * 0.8){
            //minutes hand
            ctx1.lineTo(centerClock2X, -length);
        }
        else{
            ctx1.lineTo(centerClock1X, -length-centerClock1Y);
        }
        
        ctx1.stroke();
        ctx1.rotate(-pos);


    }
    
    drawCenters(centerClock1X, centerClock1Y, 6);
    drawCenters(centerClock2X, centerClock2Y, 4);
    drawCenters(centerClock3X, centerClock3Y, 2);
    
    //center circle
    function drawCenters(x, y, radius){
        ctx1.beginPath();
        ctx1.fillStyle = "#ffffff";
        ctx1.arc(x, y, radius, 0, 2 * Math.PI);
        ctx1.fill();
        ctx1.closePath();
    }
    


}



