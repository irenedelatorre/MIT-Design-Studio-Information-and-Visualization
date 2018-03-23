
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
var path = d3.geoPath();

// prepare map (array) of data values
var enrolledPerState = d3.map();

// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.json, "../data/us_map.json") //downloaded from https://d3js.org/us-10m.v1.json
    .defer(d3.csv, "../data/data.csv", parseData)
    .await(dataloaded);

function dataloaded (err,map){

    // scale Color for the map
    var scaleColor = d3.scaleLinear().range(["#ffc5c0","#ab0405"]).domain([30,50]);

    // Bind the data to the SVG and create one path per GeoJSON feature
    plot2.selectAll(".state")
        .data(topojson.feature(map,map.objects.states).features) //geometry for the states
        .enter()
        .append("path")
        .attr("class","state")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width2", "1")
        .style("fill", function(d) {
            var id = +d.id.toString();
            var value = (enrolledPerState.get(id)).percentage;

            return scaleColor(value)
        })


}



function parseData(d){

    var id = d.Id.split("US");

    enrolledPerState.set (+id[1], {
        state: d.state,
        total: +d["Total; Estimate; Population 3 years and over enrolled in school"],
        percentage: +d["Percent; Estimate; Population 20 to 24 years - 20 to 24 year olds enrolled in school"]
    });

}