
//plot
var margin = {t: 40, r: 5, b: 40, l: 5}; //this is an object
var width = d3.select('#plot1').node().clientWidth - margin.r - margin.l,
    height = d3.select('#plot1').node().clientHeight - margin.t - margin.b;

// Append svg to div
var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b);

//create groups to put the content inside them
var plotMedal = plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'medals');
var plotText = plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'text');

var blue = "#66b2c5";
var yellow = "#ffb400";
var red = "#c63232";
var green = "#72a746";
var maxR = 70;


// calculate position of medals
var scaleX = d3.scaleBand().rangeRound([maxR*2,(width-(maxR*2))]).domain([1,2,3,4,5]).padding(0.5);
var scaleR = d3.scaleSqrt().range([5,maxR]);



// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.csv, "../data/medals.csv", parseData)

    .await(dataloaded);

function dataloaded (err,data){

    var extentMedals = d3.extent(data,function(d){return d.gold});
    scaleR.domain(extentMedals);

    draw("2016")

    d3.selectAll(".btnBarChart").on("click",function(){
        var year = this.getAttribute("id");

        draw(year)
    });

    function draw(year){

        // filter the data for the corresponding day
        // filter the data to return only the three countries with most medals
        var thisData = data.filter(function(d){return d.year===+year && d.rank<=5});

        var circles = plotMedal.selectAll(".medals")
            .data(thisData,function(d) { return d.country });

        //enter the data
        circles
            .enter()
            .append("circle")
            .attr("class","medals")
            .attr("cx",function(d){return scaleX(d.rank)})
            .attr("r",function(d){return scaleR(d.gold)})
            .style("fill",yellow)
            .attr("cy",0)
            .style("opacity",0)
            .transition()
            .duration(500)
            .style("opacity",1)
            .attr("cy",height/2);

        //exit
        circles.exit()
            .transition()
            .duration(500)
            .attr("cy",height)
            .style("opacity",0)
            .remove();

        //update
        circles
            .transition()
            .duration(500)
            .attr("cx",function(d){return scaleX(d.rank)})
            .attr("r",function(d){return scaleR(d.gold)});

        // append data for texts
        var text = plotText.selectAll(".countries")
            .data(thisData,function(d) { return d.country });

        text.enter()
            .append("text")
            .attr("class","countries")
            .text(function(d){return d.abv})
            .attr("text-anchor","middle")
            .attr("x",function(d){return scaleX(d.rank)})
            .style("opacity",0)
            .attr("y",0)
            .transition()
            .duration(500)
            .style("opacity",1)
            .attr("y",height/2);

        //exit
        text.exit()
            .transition()
            .duration(500)
            .attr("y",height)
            .style("opacity",0)
            .remove();

        //update
        text
            .transition()
            .duration(500)
            .attr("x",function(d){return scaleX(d.rank)});

    }



}

function parseData(d){

    return {
        year: +d.year,
        rank: +d.Rank,
        country: d.Country,
        abv: d.Abreviation,
        gold: +d.Gold
    }
}

