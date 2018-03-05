
var data = d3.range(1000).map(d3.randomBates(10));
//here the data is created
//yet, you would have to reference the data in a different way if you are using data from a file or from forecast.io

var formatCount = d3.format(",.0f");
//this section formats the decimal number in the horizontal axis

// here the svg, which is similar to the canvas is defined
var svg = d3.select("svg"),
    margin = {top: 10, right: 30, bottom: 30, left: 30},
    // margin parameters
    width = svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    // define the margins by caling the html object attributes of width and height and modifying them with the defined margins
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // we add an object to laterly add the rectangles to the object

// here we scale the x direction of the sketch, so the function creates a scale that can be applied to different objects 
var x = d3.scaleLinear()
    .rangeRound([0, width]);

// here we create the different bins or sections that the histogram will have
var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(20))
    (data);

// similar to the x variable, yet we add the domain function to scale the different bars of the histogram in relation to our data
var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d)  { return d.length; })]) // this function scales each bar 
    .range([height, 0]);



//"bar" variable is doing the whole scketch 
var bar = g.selectAll(".bar")
    //here we add the bars to the "g" variable that is already appended to the svg object
  .data(bins) // call the data processed in bins variable
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

//here we append the rectangles of the scketch
bar.append("rect")
    .attr("x", 1)
    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr("height", function(d) { return height - y(d.length); }); //the height attribute is defined by an option

//here we append the text that goes in the top of each rectangle
bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.length); });

//here we create the x axis, notice that we are scaling it using x
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)); // we call axisBottom from d3 library to create the x axis and the x scale to write the scale


