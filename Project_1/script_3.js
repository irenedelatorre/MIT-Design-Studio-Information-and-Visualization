var canvas3 = d3.select("#plot3").append("canvas").node();

canvas3.width = 2 * document.getElementById("plot3").clientWidth;
canvas3.height = 2 * document.getElementById("plot3").clientHeight;
var canvas3RealWidth = document.getElementById("plot3").clientWidth;
var canvas3RealHeight = document.getElementById("plot3").clientHeight;

//context is the object that actually draws
var ctx3 = canvas3.getContext('2d');

// center of the plot will be the center of our clock
var centerX = canvas3.width / 2;
var centerY = canvas3.height / 3;

//translate the center of the clock to the center of the plot
//ctx3.translate(centerX, centerY);

ctx3.scale(2,2);
setInterval(drawcanvas3, 1000);

// variables to control the format of the date and time
//var formatHour = d3.timeFormat("%I:%M");
//var format24Hour = d3.timeFormat("%H");
//var format24Minute = d3.timeFormat("%M");


var t_h = 420;
var s3 = 2; // 2 minute
var t_m = 0;

//if were going to be drawing the same thing over and over automate it 
function drawcanvas3(){
    ctx3.beginPath();
    ctx3.fillStyle = "#515151"; 
    ctx3.rect(0,0,canvas3RealWidth,canvas3RealHeight);
    ctx3.fill();
    ctx3.closePath();


    
    var hourLineVertInt = canvas3RealHeight/13;
    var hourLineHorInt = canvas3RealWidth/13;
    
    drawHours(t_h);
    
    function drawHours(t_hour){
        var t = Math.max(1,Math.floor(t_hour/60))
        var num;
        for(num=1; num<26; num++){
            ctx3.beginPath();
            ctx3.strokeStyle = "#ff4000"; 
            ctx3.rect(0,hourLineVertInt*num,num*hourLineHorInt,hourLineHorInt);   
            
            if(num <= t){
                ctx3.stroke();
                ctx3.closePath();
                ctx3.fillStyle = "#ff4000";
                ctx3.fill();
            }
        }    
    }
    
    var minLineHorInt = canvas3RealHeight/61;
    
    
    //drawMinutes
    ctx3.beginPath();
    ctx3.fillStyle = "#ffffff";
    var x = canvas3RealWidth-(1.2*hourLineHorInt);
    var height = t_m * minLineHorInt;
    ctx3.rect(x,0,hourLineHorInt, height);
    ctx3.fill();
    ctx3.closePath();
    
            
    if (t_h >= (721)){
        t_h = 0
    }else {
        t_h = t_h + s3; // sum the minute to the previous time
    }
    if (t_m >= (60)){
        t_m = 0
    }else {
        t_m = t_m + s3; // sum the minute to the previous time
    }
    
    // convert t into a date
    var thisTime3 = numberToTime2(t_h, t_m);
    // time
    ctx3.beginPath();
    ctx3.fillStyle = "#ffffff";
    ctx3.font = "100 30px avenir";
    ctx3.textAlign = "center";
    ctx3.fillText(thisTime3,canvas3RealWidth-2.5*(canvas3RealWidth/13),35);
    ctx3.closePath();



    
    function numberToTime2 (hour, min) {
        var hours   = Math.floor(hour / 60);
//        var minutes = Math.floor(min - (hours * 60));

        if (hour   < 10) {hour   = "0"+hour;}
        if (min < 10) {min = "0"+min;}
        return Math.max(1,Math.floor(t_h/60))+':'+min;
    }
    

}


    
    


    


