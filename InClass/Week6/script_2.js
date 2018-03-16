
//plot
var margin2 = {t: 5, r: 25, b: 20, l: 25}; //this is an object
var width2 = d3.select('#plot2').node().clientwidth - margin2.r - margin2.l,
    height2 = d3.select('#plot2').node().clientheight - margin2.t - margin2.b;

// Append svg to div
var plot2 = d3.select('#plot2')
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);

// function to draw the map

// prepare map (array) of data values

// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.json, "../data/us_map.json") //downloaded from https://d3js.org/us-10m.v1.json
    .defer(d3.csv, "../data/data.csv", parseData)
    .await(dataloaded);

function dataloaded (err,map){

    // scale Color for the map


    // Bind the data to the SVG and create one path per GeoJSON feature

}



function parseData(d){


}