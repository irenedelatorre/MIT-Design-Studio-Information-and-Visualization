
//plot
var margin = {t: 5, r: 25, b: 20, l: 25}; //this is an object
var width = d3.select('#plot1').node().clientWidth - margin.r - margin.l,
    height = d3.select('#plot1').node().clientHeight - margin.t - margin.b;

// Append svg to div
var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b);

// function to draw the map

// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.csv, "data/data.csv", parseData)
    .defer(d3.json, "data/us_map.json") //downloaded from https://d3js.org/us-10m.v1.json
    .await(dataloaded);

function dataloaded (err,data,map){

    // get max and min values of data

    // scale Color for the map

    // Bind the data to the SVG and create one path per GeoJSON feature

}



// total: +d["Total; Estimate; Population 3 years and over enrolled in school"],
//     percentage: +d["Percent; Estimate; Population 3 years and over enrolled in school"]


function parseData(d){

}