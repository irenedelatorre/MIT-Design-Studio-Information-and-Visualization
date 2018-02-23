// Find the canvas element by using id
var canvas2 = d3.select("#plot2").append("canvas").node();
var widthCanvas2 = d3.select("#plot2").node().clientWidth;
var heightCanvas2 = d3.select("#plot2").node().clientHeight;

// Get dimensions of canvas
//
// Retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and re-scale by using the real sizes
canvas2.width = 2 * widthCanvas2;
canvas2.height = 2 * heightCanvas2;

// Create a drawing object (getContext)
var ctx2 = canvas2.getContext("2d");

// Center of the plot will be the center of our clock
var centerX = canvas2.width/2;
var centerY = canvas2.height/2;

// Translate the center of the clock to the center of the plot
ctx2.translate(centerX, centerY);
ctx2.scale(2,2);


// In order to animate the clock we need to call the function in intervals
// In this case we will call it every second (1000 milliseconds)
setInterval(drawCanvas2, 1000);

function drawCanvas2() {
    // Set Attribute Values
    var arcThickness = 50;
    var startAngle = -Math.PI/2; // Arc's start at 0 from x-axis, we want to start at PI from x-axis (Clock)
    var revolution = 2 * Math.PI;
    var backgroundColor = "#581845";
    var secondColor = "#900C3F";
    var secondRadius = 70;
    var minuteColor = "#FF5733";
    var minuteRadius = secondRadius + arcThickness;
    var hourColor = "#FFC300";
    var hourRadius = secondRadius + 2* arcThickness;
    
    // Fill background
    ctx2.fillStyle = backgroundColor;
    ctx2.fillRect(-centerX, -centerY, canvas2.width, canvas2.height);

    // Get current date and timing
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    // Place Time
    var timeString = date.toTimeString().slice(0, 8);
    ctx2.beginPath();
    ctx2.fillStyle = "#FFF";
    ctx2.font = "100 16px Helvetica Neue LT Std";
    ctx2.textAlign = "center";
    ctx2.fillText(timeString, 0, 6);
    ctx2.closePath();
    
    // Place Time Arcs
    
    // Seconds
    if (seconds == 0) {
        seconds = 60;
        secondColor = backgroundColor;
    }
    ctx2.beginPath();
    ctx2.arc(0, 0, secondRadius, startAngle, startAngle + seconds/60 * revolution, false);
    ctx2.lineWidth = 50;
    ctx2.strokeStyle = secondColor;
    ctx2.stroke();
    ctx2.closePath();

    // Minutes
    if (minutes == 0) {
        minutes = 60;
        minuteColor = backgroundColor;
    }
    ctx2.beginPath();
    ctx2.arc(0, 0, minuteRadius, startAngle, startAngle + minutes/60 * revolution, false);
    ctx2.lineWidth = 50;
    ctx2.strokeStyle = minuteColor;
    ctx2.stroke();
    ctx2.closePath();

    // Hours
    ctx2.beginPath();
    ctx2.arc(0, 0, hourRadius, startAngle, startAngle + hour/24 * revolution, false);
    ctx2.lineWidth = 50;
    ctx2.strokeStyle = hourColor;
    ctx2.stroke();

    ctx2.closePath();
}

