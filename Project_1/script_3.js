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

// animation variables
var t_hour = 721;
var speed3 = 5; // 2 minute
var t_min = 60;

//if were going to be drawing the same thing over and over automate it 
function drawcanvas3(){
    ctx3.beginPath();
    ctx3.fillStyle = "#515151"; 
    ctx3.rect(0,0,canvas3RealWidth,canvas3RealHeight);
    ctx3.fill();
    ctx3.closePath();


    
    var hourLineVertInt = canvas3RealHeight/13;
    var hourLineHorInt = canvas3RealWidth/13;
    
    drawHours(t_hour);
    
    function drawHours(thour){
        var t = Math.max(1,Math.floor(thour/60))
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
    
    drawMinutes(t_min);
    
    function drawMinutes(tmin){
        var num;
        for(num=1; num<61; num++){
            ctx3.beginPath();
            ctx3.strokeStyle = "#000000"; 
            ctx3.rect(canvas3RealWidth-1.2*hourLineHorInt,0,hourLineHorInt,num*minLineHorInt);   

            if(num == tmin){
                ctx3.stroke();
                ctx3.closePath();
                ctx3.fillStyle = "#ffffff";
                ctx3.fill();
            }
        }          
    }
            
}
    
       // convert t into a date
    var thisTime3 = numberToTime2(t_hour, t_min);
    // time
    ctx3.beginPath();
    ctx3.fillStyle = "#000000";
    ctx3.font = "100 30px avenir";
    ctx3.textAlign = "center";
    ctx3.fillText(thisTime3,canvas3RealWidth-3.1*(canvas3RealWidth/13),35);
    ctx3.closePath();

    if (t_hour >= (721)){
        t_hour = 0
    }else {
        t_hour = t_hour + speed3; // sum the minute to the previous time
    }
    if (t_min >= (60)){
        t_min = 0
    }else {
        t_min = t_min + speed3; // sum the minute to the previous time
    }
    
    function numberToTime2 (hour, min) {
        var hours   = Math.floor(hour / 60);
        var minutes = Math.floor(min - (hours * 60));

        if (hour   < 10) {hour   = "0"+hour;}
        if (min < 10) {min = "0"+min;}
        return Math.max(1,Math.floor(t_hour/60))+':'+min;
    }
    
    


    


