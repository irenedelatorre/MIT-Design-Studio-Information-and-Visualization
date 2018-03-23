// array of data
var data = [{year: 2004, fruit: 309},{year:2005,fruit:295},{year:2006,fruit:294},{year:2007,fruit:303},{year:2008,fruit:310},{year:2009,fruit:315},
    {year:2010,fruit:311},{year:2011,fruit:309},{year:2012,fruit:308},{year:2013,fruit:303},{year:2014,fruit:296}];

//plot bar chart
var margin1 = {t: 5, r: 25, b: 20, l: 25}; //this is an object
var width1 = d3.select('#plot1').node().clientWidth - margin1.r - margin1.l,
    height1 = d3.select('#plot1').node().clientHeight - margin1.t - margin1.b;

var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width1 + margin1.r + margin1.l)
    .attr('height', height1 + margin1.t + margin1.b);

// scales to position our bars
// and to give them height
// d3 scales are translation of values into other values
// more information at https://github.com/d3/d3-scale

// 1 map (get an array) all the years in the original array
var mapYears = data.map(function(d){return d.year});
// domain are our original values, range or rangeRound the extremes in pixels of where we want to put them
// both domain and range need to have an array between the brackets
var scaleXPlot1 = d3.scaleBand().domain(mapYears).rangeRound([0, width1]).padding(0.5);

// 2 get the minimum and maximum values
var maxFruit = d3.max(data,function(d){return d.fruit});
// var minFruit = d3.min(data,function(d){return d.fruit});
var scaleYPlot1 = d3.scaleLinear().domain([0,maxFruit]).rangeRound([height1, 0]);

//create groups to put the content inside them
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'axis axis-y');
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + (margin1.t+height1) + ')').attr('class', 'axis axis-x');
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'bars');


//AXIS
var axisBarChartX = d3.axisBottom().scale(scaleXPlot1).ticks(),
    axisBarChartY = d3.axisLeft().scale(scaleYPlot1).tickSizeInner(-width1).tickPadding([5]).ticks(3);

plot1.select(".axis-x").call(axisBarChartX);
plot1.select(".axis-y").call(axisBarChartY);

plot1.select('.bars')
    .selectAll(".barsFruit") //select a Bar that we will create in a few steps
    .data(data) //select the data
    .enter() //input the data
    .append("rect")
    .attr("class", "barsFruit") // this is the same class that we have selected before
    .attr("x", function(d) { return scaleXPlot1(d.year); })
    .attr("y", function(d) { return scaleYPlot1(d.fruit); })
    .attr("width", scaleXPlot1.bandwidth())
    .attr("height", function(d) { return (height1 - scaleYPlot1(d.fruit)) })
    .style("fill","#00A3BF");


/// plot 2
//plot bar chart
var margin2 = {t: 5, r: 25, b: 20, l: 25}; //this is an object
var width2 = d3.select('#plot2').node().clientWidth - margin1.r - margin1.l,
    height2 = d3.select('#plot2').node().clientHeight - margin1.t - margin1.b;

var plot2 = d3.select('#plot2') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);



d3.csv("../data/data.csv", parseData, drawData);

function parseData(d){
    return {
        year: +d.year,
        fruit: +d.fruit,
        vegetable: +d.vegetables
    }
}

function drawData(dataAll){

    console.log(dataAll) //check your data

    // 1 map (get an array) all the years in the original array
    var mapYears = dataAll.map(function(d){return d.year});

    // domain are our original values, range or rangeRound the extremes in pixels of where we want to put them
    // both domain and range need to have an array between the brackets
    var scaleXPlot2 = d3.scaleBand().domain(mapYears).rangeRound([0, width2]);

    // 2 get the minimum and maximum values
    var maxVeg = d3.max(dataAll,function(d){return d.vegetable});
    var scaleYPlot2 = d3.scaleLinear().domain([0,maxVeg]).rangeRound([height2, 0]);


    //functions to create the lines
    var lineFruit = d3.line()
        .x(function(d) { return scaleXPlot2(d.year); })
        .y(function(d) { return scaleYPlot2(d.fruit); });

    var lineVeg = d3.line()
        .x(function(d) { return scaleXPlot2(d.year); })
        .y(function(d) { return scaleYPlot2(d.vegetable); });

    //create groups to put the content inside them
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')').attr('class', 'axis axis-y');
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + (margin2.t+height2) + ')').attr('class', 'axis axis-x');
    plot2.append('g').attr('transform', 'translate(' + (margin2.l + width2/(dataAll.length*2)) + ',' + margin2.t + ')').attr('class', 'produce');


    //AXIS
    var axisLineChartX = d3.axisBottom().scale(scaleXPlot2).tickSizeInner(-height2).tickPadding([10]).ticks(),
        axisLineChartY = d3.axisLeft().scale(scaleYPlot2).tickSizeInner(-width2).tickPadding([5]).ticks(3);

    plot2.select(".axis-x").call(axisLineChartX);
    plot2.select(".axis-y").call(axisLineChartY);

    plot2.select(".produce")
        .append("path")
        .datum(dataAll)
        .attr("fill", "none")
        .attr("stroke", "#00A3BF")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", lineFruit);

    plot2.select(".produce")
        .append("path")
        .datum(dataAll)
        .attr("fill", "none")
        .attr("stroke", "#ff5533")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", lineVeg);
}
