var canvas2 = d3.select("#plot2").append("canvas").node();

canvas2.width = 2 * document.getElementById("plot2").clientWidth;
canvas2.height = 2 * document.getElementById("plot2").clientHeight;
var canvas2RealWidth = document.getElementById("plot2").clientWidth;
var canvas2RealHeight = document.getElementById("plot2").clientHeight;

//context is the object that actually draws
var ctx2 = canvas2.getContext('2d');

// center of the plot will be the center of our clock
var centerX = canvas2.width / 2;
var centerY = canvas2.height / 3;

//translate the center of the clock to the center of the plot
ctx2.translate(centerX, centerY);

ctx2.scale(2,2);
setInterval(drawCanvas2, 1000);

// variables to control the format of the date and time
var formatHour = d3.timeFormat("%I:%M");
var format24Hour = d3.timeFormat("%H");
var format24Minute = d3.timeFormat("%M");

// animation variables
var t_hour = 721;
var speed = 1; // 2 minute
var t_min = 60;

//if were going to be drawing the same thing over and over automate it 
function drawCanvas2(){
    
    ctx2.beginPath();
    ctx2.fillStyle = "#5e412f"; 
    ctx2.rect(-canvas2RealWidth/2,-canvas2RealHeight/3,canvas2RealWidth,canvas2RealHeight);
    ctx2.fill();
    ctx2.closePath();
    
    var OuterRadius = 200;
    
    drawConcentricCircles(0,0, OuterRadius);
    
    function drawConcentricCircles(X, Y, radius){
        var num;
        var currentRadius = radius;
        var offset = radius/12;
        
        for(num=1; num<13; num++){
            // start drawing
            ctx2.beginPath();

            // determine style of the form
            ctx2.strokeStyle = "#fcebb6";
            ctx2.lineWidth = 3;
            
            var t = Math.max(1,Math.floor(t_hour/60));
            if(num==t){
                ctx2.fillStyle = "#78c0a8";
            }
            else{
                ctx2.fillStyle = "#5e412f";
            }

            ctx2.arc(X, Y, currentRadius, 0, 2 * Math.PI);

            // stroke your drawing
            ctx2.stroke();
            ctx2.fill();

            //end drawing   
            ctx2.closePath();
            currentRadius = currentRadius-offset;
        } 
    }
    
    drawWedges(0,0, OuterRadius);
    
    function drawWedges(X, Y, radius){
        var num;
        var ang = 0;
        var angIncrement = 6*Math.PI/180;
        
        for(num=1; num<61; num++){
            //make the lines 
            ctx2.beginPath();
            ctx2.strokeStyle = "#fcebb6";
            ctx2.lineWidth = 1;
            ctx2.moveTo(0, 0);
            ctx2.rotate(ang);
            ctx2.lineTo(0, -radius);
            ctx2.stroke();
            ctx2.rotate(-ang);
            ang += angIncrement;
            ctx2.restore();
        }
    
    fillMinuteWedge(t_min);
        
    function fillMinuteWedge(t){
        var angIncrement = 6*Math.PI/180;
        
        ctx2.beginPath();
        ctx2.strokeStyle = "#78c0a8";
        ctx2.lineWidth = 1;
        ctx2.moveTo(0, 0);
        ctx2.rotate(angIncrement*t);
        ctx2.lineTo(0, -radius);
        ctx2.stroke();
        ctx2.rotate(-angIncrement*t);
        
        ctx2.rotate(angIncrement*(t+1));
        ctx2.lineTo(0, -radius);
        ctx2.stroke();
        
        ctx2.closePath();
        ctx2.fillStyle = "#f0a830";
        ctx2.fill();
    
        ctx2.rotate(-angIncrement*(t+1));
    }
        
}
    
    
    // convert t into a date
    var thisTime = numberToTime(t_hour, t_min);
    // time
    ctx2.beginPath();
    ctx2.fillStyle = "#f07818";
    ctx2.font = "100 80px avenir";
    ctx2.textAlign = "center";
    ctx2.fillText(thisTime,0,canvas2RealHeight/2);
    ctx2.closePath();

    if (t_hour >= (721)){
        t_hour = 0
    }else {
        t_hour = t_hour + speed; // sum the minute to the previous time
    }
    if (t_min >= (60)){
        t_min = 0
    }else {
        t_min = t_min + speed; // sum the minute to the previous time
    }
    
function numberToTime (hour, min) {
    var hours   = Math.floor(hour / 60);
    var minutes = Math.floor(min - (hours * 60));

    if (hour   < 10) {hour   = "0"+hour;}
    if (min < 10) {min = "0"+min;}
    return Math.max(1,Math.floor(t_hour/60))+':'+min;
}

    
}

