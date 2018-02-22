// array of data
var data = [{year: 2004, fruit: 309},{year:2005,fruit:295},{year:2006,fruit:294},{year:2007,fruit:303},{year:2008,fruit:310},{year:2009,fruit:315},
    {year:2010,fruit:311},{year:2011,fruit:309},{year:2012,fruit:308},{year:2013,fruit:303},{year:2014,fruit:296}];

//plot bar chart
var margin1 = {t: 5, r: 25, b: 20, l: 25};
var width1 = d3.select('#plot2').node().clientWidth - margin1.r - margin1.l,
    height1 = d3.select('#plot2').node().clientHeight - margin1.t - margin1.b;

var plot1 = d3.select('#plot2') 
    .append('svg')
    .attr('width', width1 + margin1.r + margin1.l)
    .attr('height', height1 + margin1.t + margin1.b);

//create groups to put the content inside them
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'axis axis-y');
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + (margin1.t+height1) + ')').attr('class', 'axis axis-x');
plot1.append('g').attr('transform', 'translate(' + margin1.l + ',' + margin1.t + ')').attr('class', 'dots');


//AXIS
var axisBarChartX = d3.axisBottom().scale(scaleXPlot1).ticks(),
    axisBarChartY = d3.axisLeft().scale(scaleYPlot1).tickSizeInner(-width1).tickPadding([5]).ticks(3);

plot1.select(".axis-x").call(axisBarChartX);
plot1.select(".axis-y").call(axisBarChartY);

var x = d3.year.scale().range([0, width1]);
var y = d3.scale.linear().range([height1, 0]);
x.domain(d3.extent(data, function(d) { return d.year; }));    
y.domain([0, d3.max(data, function(d) { return d.fruit; })]);

plot1.select('.dots')
    .selectAll(".barsFruit") //select a Bar that we will create in a few steps
    .data(data) //select the data
    .enter() //input the data
    .append("circle")
    .attr("r", 20)

    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.close); })

    .style("fill","#00A3BF");
