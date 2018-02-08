// find the canvas2 element by using id
var canvas2 = d3.select("#plot2").append("canvas").node();
var widthCanvas2 = d3.select("#plot2").node().clientWidth;
var heightCanvas2 = d3.select("#plot2").node().clientHeight;

// get dimensions of canvas
// retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and re-scale by using the real sizes
// this is not necessary
canvas2.width = 2 * widthCanvas2;
canvas2.height = 2 * heightCanvas2;

// if you want to avoid this step
// canvas2.widthCanvas2 = widthCanvas2;
// canvas2.heightCanvas2 = heightCanvas2;

// create a drawing object (getContext)
var ctx2 = canvas2.getContext("2d");

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
var formatHour = d3.timeFormat("%I:%M");
var format24Hour = d3.timeFormat("%H");
var format24Minute = d3.timeFormat("%M");


// variables
var radius = 50;
var radiusStars = 1;
var topFloor = 2 * heightCanvas2/3;
var sunTimes = [6*60,12*60,18*60];
var moonTimes = [0,6*60,18*60,24*60];

// functions to control colors and positions
var scaleColorSky = d3.scaleLinear().domain([0,(6*60),(8*60),(17*60),(18*60),(24*60)]).range(["#491895","#d55f85","#57bbe9","#57bbe9","#491895","#491895"]);
var scaleColorFloor = d3.scaleLinear().domain([0,(6*60),(8*60),(17*60),(18*60),(24*60)]).range(["#292f4d","#a96a7f","#aece20","#aece20","#292f4d","#292f4d"]);
var scaleSunX = d3.scaleLinear().domain(sunTimes).range([0,widthCanvas2/2,(widthCanvas2)]);
var scaleSunY = d3.scaleLinear().domain(sunTimes).range([topFloor+radius, (topFloor - topFloor*0.35), topFloor+radius]);
var scaleMoonX_1 = d3.scaleLinear().domain([moonTimes[0],moonTimes[1]]).range([widthCanvas2/2,(widthCanvas2)]);
var scaleMoonX_2 = d3.scaleLinear().domain([moonTimes[2],moonTimes[3]]).range([0,widthCanvas2/2]);
var scaleMoonY_1 = d3.scaleLinear().domain([moonTimes[0],moonTimes[1]]).range([(topFloor - topFloor*0.35),topFloor+radius]);
var scaleMoonY_2 = d3.scaleLinear().domain([moonTimes[2],moonTimes[3]]).range([topFloor + radius,(topFloor - topFloor*0.35)]);


// create array with random numbers for stars
var stars = [];

for (var i=0; i<500; i++){
    var randomX = getRandomArbitrary(0,widthCanvas2);
    var randomY = getRandomArbitrary(0, topFloor);
    var randomOpacity = getRandomArbitrary(0,1)

    stars.push({x:randomX, y:randomY,opacity:randomOpacity})
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// animation variables
var t = 20*60;
var speed = 2; // 2 minute


// SKETCH
ctx2.scale(2,2);

// draw canvas2
// in order to animate we need to call the function in intervals

function drawcanvas2() {

    // convert t into a date
    var thisTime = numberToTime(t);

    //re-start the canvas (otherwise it will paint over the previous image)
    // start drawing

    //SKY
    //ctx.rect(x,y,width,height);
    ctx2.beginPath();
    ctx2.fillStyle = scaleColorSky(t); //change the color of the floor depending on the time
    ctx2.rect(0,0,widthCanvas2,heightCanvas2);
    ctx2.fill();
    ctx2.closePath();


    //SUN AND MOON
    //arc(x,y,radius,startAngle,endAngle)
    if (t>=sunTimes[0] && t <=sunTimes[sunTimes.length-1]){
        ctx2.beginPath();
        ctx2.fillStyle = "#fab711";
        ctx2.arc(scaleSunX(t), scaleSunY(t), radius, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.closePath();
    }else {

        var x;
        var y;

        if (t>=moonTimes[0] && t<=moonTimes[1]){
            x = scaleMoonX_1(t);
            y = scaleMoonY_1(t);
        }else{
            x = scaleMoonX_2(t);
            y = scaleMoonY_2(t);
        }

        for (var s=0; s<stars.length; s++){
            ctx2.beginPath();
            ctx2.fillStyle = "#fff";
            ctx2.globalAlpha = stars[s].opacity;
            ctx2.globalCompositeOperation = 'screen';
            ctx2.arc(stars[s].x, stars[s].y, radiusStars, 0, 2 * Math.PI);
            ctx2.fill();
            ctx2.globalAlpha = 1;
            ctx2.globalCompositeOperation = 'normal';
            ctx2.closePath();
        }

        ctx2.beginPath();
        ctx2.fillStyle = "#fff";
        ctx2.arc(x, y, radius, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.closePath();

        ctx2.beginPath();
        ctx2.fillStyle = scaleColorSky(t);
        ctx2.arc(x + radius*0.75, y, radius, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.closePath();

    }

    //FLOOR
    // determine the form
    ctx2.beginPath();
    ctx2.fillStyle = scaleColorFloor(t); //change the color of the floor depending on the time
    ctx2.rect(0,topFloor,widthCanvas2,heightCanvas2);
    ctx2.fill();
    ctx2.closePath();




    // time
    ctx2.beginPath();
    ctx2.fillStyle = "#FFF";
    ctx2.font = "100 80px Helvetica Neue LT Std";
    ctx2.textAlign = "center";
    ctx2.fillText(thisTime,widthCanvas2/2,heightCanvas2/4);
    ctx2.closePath();

    if (t >= (24*60)){
        t = 0
    }else {
        t = t + speed; // sum the minute to the previous time
    }

    requestAnimationFrame(drawcanvas2);

}

drawcanvas2()




function numberToTime (d) {
    var hours   = Math.floor(d / 60);
    var minutes = Math.floor(d - (hours * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+':'+minutes;
}
