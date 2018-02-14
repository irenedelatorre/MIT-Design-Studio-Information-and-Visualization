// find the canvas element by using id
var canvas1 = document.getElementById("plot1");

canvas1.width = 2 * document.getElementById("plot1").clientWidth;
canvas1.height = 2 * document.getElementById("plot1").clientHeight;

// create a drawing object (getContext)
var ctx1 = canvas1.getContext("2d");

ctx1.fillStyle = "#555555";
ctx1.fillRect(0, 0, 500, 500);
