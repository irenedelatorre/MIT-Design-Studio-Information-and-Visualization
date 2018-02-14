// Find the canvas element by using id
var canvas3 = d3.select("#plot3").append("canvas").node();
var widthCanvas3 = d3.select("#plot3").node().clientWidth;
var heightCanvas3 = d3.select("#plot3").node().clientHeight;

// Get dimensions of canvas
//
// Retina and new screens have very good resolutions. Canvases drawings might look a bit blurry in them.
// to avoid this problem we can scale the size of the canvas twice, and re-scale by using the real sizes
canvas3.width = 2 * widthCanvas3;
canvas3.height = 2 * heightCanvas3;

// Create a drawing object (getContext)
var ctx3 = canvas3.getContext("2d");
ctx3.scale(2,2);

// Set Attributes
var canvasWidth = canvas3.width/2; // Width of canvas
var canvasHeight = canvas3.height/2; // Height of canvas
var groundHeight = 30; // Height of ground rectangle
var blockLength = canvasWidth/70; // Size of a single block representing a minute
var groundY = canvasHeight - groundHeight; // y-value representing current ground plane
var minutesInRow = 15;
var groundX = 0.5 * (canvasWidth - minutesInRow * blockLength); // x-value representing offset of time tower
var hourBarHang = 10; // Amount of overhang on each hour bar
var skyColor = "#843a8c";
var floorColor = "#604961";
var minuteBlockColor = "#ada460";
var hourBlockColor = "#3f3b14";

function resetClock() {
    drawEnvironment();
}

function drawEnvironment() {
    ctx3.fillStyle = skyColor;
    ctx3.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx3.fillStyle = floorColor;
    ctx3.fillRect(0, groundY, canvasWidth, groundHeight);
    drawStars();
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function drawStars() {
    // Create array with random numbers for stars
    var stars = [];
    var radiusStars = 1;

    for (var i=0; i<500; i++){
        var randomX = getRandomArbitrary(0,widthCanvas3);
        var randomY = getRandomArbitrary(0, groundY);
        var randomOpacity = getRandomArbitrary(0,1);

        stars.push({x:randomX, y:randomY,opacity:randomOpacity})
    }

    for (var s=0; s<stars.length; s++){
        ctx3.beginPath();
        ctx3.fillStyle = "#fff";
        ctx3.globalAlpha = stars[s].opacity;
        ctx3.globalCompositeOperation = 'screen';
        ctx3.arc(stars[s].x, stars[s].y, radiusStars, 0, 2 * Math.PI);
        ctx3.fill();
        ctx3.globalAlpha = 1;
        ctx3.globalCompositeOperation = 'normal';
        ctx3.closePath();
    }
}

// Draw Environment
drawEnvironment();

// Get Hours and Minutes
var date = new Date();
var hour = date.getHours();
var minutes = date.getMinutes();

// Place Elapsed Hours
for (var i = 0; i < hour; i++) {   
    // Place minutes
    for (var j = 0; j < 60; j++) {
        ctx3.fillStyle = minuteBlockColor;
        groundY = j % minutesInRow == 0 ? groundY - blockLength : groundY; // Each line permits 15 blocks
        ctx3.fillRect(groundX + (j % minutesInRow) * blockLength, groundY, blockLength , blockLength);
    }
    
    // Place Hour Bar
    groundY -= blockLength;
    ctx3.fillStyle = hourBlockColor;
    ctx3.fillRect(groundX - hourBarHang, groundY, minutesInRow * blockLength + 2 * hourBarHang, blockLength);
}

// Used to randomize the placement of blocks in current minute
var columnsLeft = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Place Elapsed Minutes within Current Hour
for (var i = 0; i < minutes; i++) {
    groundY = i % minutesInRow == 0 ? groundY - blockLength : groundY; // Each line permits 15 blocks
    columnsLeft = i % minutesInRow == 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] : columnsLeft;
    ctx3.fillStyle = minuteBlockColor;
    var randVal = Math.floor(Math.random() * columnsLeft.length);
    var xOffset = columnsLeft[randVal];
    ctx3.fillRect(groundX + xOffset * blockLength, groundY, blockLength , blockLength);
    columnsLeft.splice(randVal, 1); // Remove column from  columnsLeft list
}

// Handle Current Minute
setInterval(drawSecondBlock, 1000);

// Set up intial values
var seconds = date.getSeconds();
randVal = Math.floor(Math.random() * columnsLeft.length);
var currentX = columnsLeft[randVal];           
columnsLeft.splice(randVal, 1); // Remove column from  columnsLeft list
var currentY = groundY - (58-seconds)*blockLength;
var firstFunctionCall = true;

function drawSecondBlock() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    // Clear last block timestep
    if (seconds != 0 && !firstFunctionCall) {
        ctx3.fillStyle = skyColor;
        ctx3.fillRect(groundX + (currentX-1) * blockLength, currentY - 2 * blockLength, 3*blockLength, 2 * blockLength);
    }
    
    // New minute
    if (seconds == 0) {
        currentX = groundX;
        randVal = Math.floor(Math.random() * columnsLeft.length);
        currentX = columnsLeft[randVal]; 
        columnsLeft.splice(randVal, 1); // Remove column from  columnsLeft list
        currentY = groundY - 60*blockLength;
    }
    
    ctx3.fillStyle = minuteBlockColor;
    groundY = columnsLeft.length == 0 ? groundY - blockLength : groundY; // Each line permits 15 blocks
    columnsLeft = columnsLeft.length == 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] : columnsLeft;
    ctx3.fillRect(groundX + currentX * blockLength, currentY, blockLength , blockLength);
    currentY += blockLength;
    firstFunctionCall = false;
    
    // Handle Currrent Hour
    if (minutes == 0 && seconds == 0) {
        ctx3.fillStyle = hourBlockColor;
        ctx3.fillRect(groundX - hourBarHang, groundY, minutesInRow * blockLength + 2 * hourBarHang, blockLength);
        groundY -= blockLength;
    }
    
    // Reset if end of day
    if (hour == 0 && minutes == 0 && seconds == 0) {
        resetClock();
    }
}