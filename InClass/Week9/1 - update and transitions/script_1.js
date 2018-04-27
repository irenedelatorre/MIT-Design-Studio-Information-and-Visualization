
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
    .defer(d3.csv, "data/medals.csv", parseData)

    .await(dataloaded);

function dataloaded (err,data){

    //TODO search for the maximum and minimum gold medals


    //TODO update ScaleR according to the minimum and maximum values of  gold medals


    draw();

    //TODO draw plot depending on year selected


    function draw(year){

        // filter the data for the corresponding day
        // filter the data to return only the three countries with most medals


        //TODO append data to draw circles
        // var circles = ...;

        //enter the data


        //exit

        //update


        //TODO append data for texts
        // var text = ...



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

