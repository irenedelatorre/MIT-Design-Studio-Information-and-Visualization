// find the canvas3 element by using id
var canvas3 = d3.select("#plot3").append("canvas").node();
var widthCanvas3 = d3.select("#plot3").node().clientWidth;
var heightCanvas3 = d3.select("#plot3").node().clientHeight;

// get dimensions of canvas
// retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and re-scale by using the real sizes
// this is not necessary
canvas3.width = 2 * widthCanvas3;
canvas3.height = 2 * heightCanvas3;

// if you want to avoid this step
// canvas3.widthCanvas3 = widthCanvas3;
// canvas3.heightCanvas3 = heightCanvas3;

// create a drawing object (getContext)
var ctx3 = canvas3.getContext("2d");

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


// variables to control the format of the date and time
var format24Hour = d3.timeFormat("%H");
var format24Minute = d3.timeFormat("%M");
var formatSecond = d3.timeFormat("%S");


// create array with past hours
var times = [];


for (var h=0; h<25; h++){
    for (var m=0; m<60; m++){
        for (var s=0; s<60; s++){
            times.push({
                hour: h,
                minute: m,
                second: s,
            });
        }
    }
}




function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}




// SKETCH 1
ctx3.scale(2,2);
// center of the plot will be the center of our clock
var center3X = 1.15*widthCanvas3 / 2;
var center3Y = heightCanvas3 / 2;

//translate the center of the clock to the center of the plot
ctx3.translate(center3X, center3Y);

setInterval(drawCanvas3, 1000); //draw every second

function drawCanvas3 () {

    // var currentTime = new Date("06-February-2018 23:59:59").getTime();
    var currentTime = new Date().getTime();

    var hour = +(format24Hour(currentTime));
    var minute = +(format24Minute(currentTime));
    var second = +(formatSecond(currentTime));

    var filteredTimes = times.filter(function(d){
        var point = false;

        if (d.hour<hour){
            point = true
        }else if (d.hour === hour && d.minute < minute){
            point = true
        }else if (d.hour === hour && d.minute < minute && d.second <=second){
            point = true
        }else {
            point = false
        }

        return point === true
    });

    var radius = 4;

    //re-start the canvas (otherwise it will paint over the previous image)
    // start drawing

    //SKY
    //ctx.rect(x,y,width,height);
    ctx3.beginPath();
    ctx3.fillStyle = "#000";
    ctx3.rect(-widthCanvas3,-heightCanvas3,widthCanvas3*2,heightCanvas3*2);
    ctx3.fill();
    ctx3.closePath();

    var nestedHour = d3.nest()
        .key(function(d){return d.hour})
        .key(function(d){return d.minute})
        .sortValues(function(a,b){return a.second - b.second})
        .entries(filteredTimes);

    console.log(nestedHour)

    for (var t=0; t<nestedHour.length; t++){

        var h = +nestedHour[t].key;
        var nestHourValues = nestedHour[t].values;

        var angH = (h * 23) * Math.PI / 180;

        //hour
        ctx3.save();
        ctx3.beginPath();
        ctx3.globalAlpha = 1;
        ctx3.lineWidth = 1;
        ctx3.globalCompositeOperation = "normal";
        ctx3.strokeStyle = "#000";
        ctx3.fillStyle = "rgba(255,255,255,0.1)";
        ctx3.rotate(angH);
        ctx3.translate(radius*h, radius*h * 0.95);
        ctx3.arc(0,0,radius*h,0,2*Math.PI);
        ctx3.stroke();
        ctx3.fill()
        ctx3.closePath();

        for (var j=0; j<nestHourValues.length; j++){
            var m = +nestHourValues[j].key;
            var nestMinuteValues = nestHourValues[j].values;

            var angM = (m * 30) * Math.PI / 180;

            //minute
            ctx3.beginPath();
            ctx3.globalAlpha = 0.25;
            ctx3.globalCompositeOperation = "screen";
            ctx3.lineWidth = 0.5;
            ctx3.strokeStyle = "#868686";
            ctx3.rotate(angM);
            ctx3.translate(radius * m/20, radius * m/20 * 0.95);
            ctx3.arc(0,0,radius * m/20,0,2*Math.PI);
            ctx3.stroke();
            ctx3.closePath();

            for (var z=0; z < nestMinuteValues.length; z++){

                var s = nestMinuteValues[z].second;
                var angS = (s * 30) * Math.PI / 180;

                ctx3.beginPath();
                ctx3.globalAlpha = 0.05;
                ctx3.lineWidth = 0.25;
                ctx3.globalCompositeOperation = "screen";
                ctx3.strokeStyle = "#b5b5b5";
                ctx3.rotate(angS);
                ctx3.translate(radius * s/60, (radius * s/60) * 0.95);
                ctx3.arc(0,0,radius * s/120,0,2*Math.PI);
                ctx3.stroke();
                ctx3.closePath();
                ctx3.globalCompositeOperation = "normal";


            }

        }


        ctx3.restore();
    }

    var timeText;


    if (minute<=9){
        timeText = ""+hour+":0"+minute+"";
    }else{
        timeText = ""+hour+":"+minute+"";
    }

    ctx3.translate(-center3X, -center3Y);

    // time
    ctx3.beginPath();
    ctx3.fillStyle = "#d4d4d4";
    ctx3.font = "100 14px Helvetica Neue LT Std";
    ctx3.textAlign = "center";
    ctx3.fillText(timeText,widthCanvas3/2,0.25*heightCanvas3/2);
    ctx3.closePath();

    ctx3.translate(center3X, center3Y);


}

function numberToTime (d) {
    var hours   = Math.floor(d / 60);
    var minutes = Math.floor(d - (hours * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+':'+minutes;
}
