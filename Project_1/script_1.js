// find the canvas element by using id
var canvas1 = document.getElementById("plot1");

// get dimensions of canvas 1
// retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and then scale back to normal in CSS
// this is not necessary
canvas1.width = 2 * document.getElementById("plot1").clientWidth;
canvas1.height = 2 * document.getElementById("plot1").clientHeight;
var canvas1RealWidth = document.getElementById("plot1").clientWidth;
var canvas1RealHeigt = document.getElementById("plot1").clientHeight;

// create a drawing object (getContext)
var ctx1 = canvas1.getContext("2d");

// center of the plot will be the center of our clock
var centerX = canvas1.width/2;
var centerY = canvas1.height/2;

//translate the center of the clock to the center of the plot
ctx1.translate(centerX, centerY);
ctx1.scale(2,2);

// Set Attribute Values
var baseRadius = 0.75 * (canvas1RealWidth / 2);
var baseX = 0;
var baseY = 0;
var baseColor = "#FFB85F";
var baseCircle = new Circle(baseX, baseY, baseRadius, baseColor, 1);
var nHours = 24;
var hourColor = "#462066";
var nMinutes = 60;
var minuteColor = "#8ED2C9";
var startAngle = 270;

// Fill background
ctx1.fillStyle = "#000000";
ctx1.fillRect(-centerX, -centerY, canvas1.width, canvas1.height);

function Circle(x,y,r, color, number) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.number = number;
}

Circle.prototype.draw = function() {
    ctx1.beginPath();
    ctx1.arc(this.x,this.y,this.r, 0, 2 * Math.PI, false);
    ctx1.fillStyle = this.color;
    ctx1.fill();
    ctx1.lineWidth = 0;
}

function Hour(x,y,r, color, number, minutes) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.number = number;
    this.color = color;
    this.minutes = minutes;
}

Hour.prototype.draw = function() {
    ctx1.beginPath();
    ctx1.arc(this.x,this.y,this.r, 0, 2 * Math.PI, false);
    ctx1.fillStyle = this.color;
    ctx1.fill();
    ctx1.lineWidth = 0;
    ctx1.font = "100 12px Helvetica Neue LT Std";
    ctx1.textAlign = "center";
    ctx1.fillStyle = "#ffffff";
    ctx1.fillText(this.number ,this.x, this.y);
    this.minutes.forEach(function (ele) {
        ele.draw();
    });
}

var hours = new Array();

function calcCircles(num, baseRadius, startAngle) {
    var hourAngle = Math.PI / num;
    var hourS = Math.sin(hourAngle);
    var hourR = baseRadius * hourS / (1+hourS);
    
    for(var i=0;i<num/2;++i) {
        
        var hourPhi = Math.PI * startAngle / 180 + hourAngle * i * 2;
        var hourX = baseX + (baseRadius - hourR) * Math.cos(hourPhi);
        var hourY = baseY +(baseRadius - hourR) * Math.sin(hourPhi);
        var minutes = new Array();
        
        var minuteAngle = Math.PI / nMinutes;
        var minuteS = Math.sin(minuteAngle);
        var minuteR = hourR * minuteS / (1+minuteS);
        
        for(var j=0;j<nMinutes;++j) {
            var phi = Math.PI * startAngle / 180 + minuteAngle * j * 2;
            var cx = hourX + (hourR - minuteR) * Math.cos(phi);
            var cy = hourY +(hourR - minuteR) * Math.sin(phi);
            minutes.push(new Circle(cx,cy,minuteR, minuteColor, j+1));
        }
        var hour = new Hour(hourX, hourY, hourR, hourColor, i+1, minutes);
        hours.push(hour);
    }
}

calcCircles(nHours, baseRadius, startAngle);

function draw() {
    //baseCircle.draw();
    hours.forEach(function(ele){
        ele.draw();
    });
}

draw();
