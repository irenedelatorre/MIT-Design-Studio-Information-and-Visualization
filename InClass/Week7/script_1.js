
//plot
var margin = {t: 5, r: 25, b: 20, l: 50}; //this is an object
var width = d3.select('#plot1').node().clientWidth - margin.r - margin.l,
    height = d3.select('#plot1').node().clientHeight - margin.t - margin.b;

// Append svg to div
var plot1 = d3.select('#plot1') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b);


/// plot 2
var margin2 = {t: 5, r: 25, b: 20, l: 50}; //this is an object
var width2 = d3.select('#plot2').node().clientWidth - margin2.r - margin2.l,
    height2 = d3.select('#plot2').node().clientHeight - margin2.t - margin2.b;

var plot2 = d3.select('#plot2') // if we select a html id #name, if we select a class .name
    .append('svg')
    .attr('width', width2 + margin2.r + margin2.l)
    .attr('height', height2 + margin2.t + margin2.b);


var blue = "#66b2c5";
var yellow = "#ffb400";
var red = "#c63232";
var green = "#72a746";
var formatNumber = d3.format(",");

// create type dispatch to update plot2


// queue data files, parse them and use them
var queue = d3.queue()
    .defer(d3.csv, "data/Households_by_total_money_income.csv", parseData)
    .defer(d3.csv, "data/Households_by_total_money_income_by_race_age.csv", parseIncome)
    .await(dataloaded);

function dataloaded (err,data,dataAge){

    console.log(data);

    // This data mixes different types of categories
    // to be able to work with the subcategories inside a main category
    // nest by metric (main categorization)



    // Y axis
    // 1 by total (region)
    var maxTotalValueRegion = d3.max(nestedByMetric[2].values,function(d){
        if (d.second_category === "Total"){
            return d.total
        }
    });

    // (division)
    var maxTotalValueDivision = d3.max(nestedByMetric[2].values,function(d){
        if (d.second_category !== "Total"){
            return d.total
        }
    });

    var scaleYPlot1 =  d3.scaleLinear().domain([0,maxTotalValueRegion]).rangeRound([height, 0]);

    // X axis
    // regions
    var mapRegions = (nestedByMetric[2].values).map(function(d){
        if (d.second_category === "Total"){
            return d.first_category
        }
    });

    mapRegions = mapRegions.filter(function(d){return d !== undefined});

    var mapDivisions = (nestedByMetric[2].values).map(function(d){
        if (d.second_category !== "Total"){
            return d.second_category
        }
    });

    mapDivisions = mapDivisions.filter(function(d){return d !== undefined});

    var scaleXPlot1 = d3.scaleBand().domain(mapRegions).rangeRound([0, width]).padding(0.5);
    var scaleColors = d3.scaleOrdinal().domain(mapRegions).range([blue,yellow,red,green]);

    //create groups to put the content inside them
    plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'axis axis-y');
    plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + (margin.t+height) + ')').attr('class', 'axis axis-x');
    plot1.append('g').attr('transform', 'translate(' + margin.l + ',' + margin.t + ')').attr('class', 'bars');

    //AXIS
    var axisBarChartX = d3.axisBottom().scale(scaleXPlot1).ticks(),
        axisBarChartY = d3.axisLeft().scale(scaleYPlot1).tickSizeInner(-width).tickPadding([5]).ticks(3);

    var dataRegion = (nestedByMetric[2].values).filter(function(d){return d.second_category === "Total"});
    var dataDivision = (nestedByMetric[2].values).filter(function(d){return d.second_category !== "Total"});

    drawBarchart(dataRegion);

    function drawPlot1 (_data){
        plot1.select(".axis-x").transition().duration(1000).call(axisBarChartX);
        plot1.select(".axis-y").transition().duration(1000).call(axisBarChartY);


        var plotBars = plot1.select('.bars')
            .selectAll(".bar") //select a Bar that we will create in a few steps
            .data(_data,function(d) { return d ? d.first_category : this.first_category; }); //select the data

        plotBars
            .enter()//input the data
            .append("rect")
            .attr("class", "bar") // this is the same class that we have selected before
            .attr("x", function(d) {return scaleXPlot1(d.first_category); })
            .attr("y", function(d) { return scaleYPlot1(d.total); })
            .attr("width", scaleXPlot1.bandwidth())
            .attr("height", function(d) { return (height - scaleYPlot1(d.total)) })
            .style("fill",function(d){return scaleColors(d.first_category)});
        //add mouseover event
    }


    // control what is being drawn with a general variable

    // functions to draw

    //function click

    //function mouseover



    // plot 2
    var nestedByRace = d3.nest()
        .key(function(d){return d.race})
        .entries(dataAge.filter(function(d){return d.age_range !== "Mean age of householder"}));

    // X axis
    // ages
    var mapAges = (nestedByRace[0].values).map(function(d){return d.age_range});
    var scaleXAge = d3.scaleBand().domain(mapAges).rangeRound([0, width2]).padding(0.5);

    // options that will update the data in the graph
    var valuesPlot2 = [{value:"Member income",n:0},{value:"Median income",n:1},{value:"Mean income",n:2}];

    // append options to the html element
    valuesPlot2.forEach(function(d){
        var plus = " (By household)";

        if(d.value === "Member income"){
            plus = " (By member)"
        }
        d3.select(".values-list")
            .append("option")
            .html(d.value + plus)
            .attr("value", d.value);
    });

    // when the html element changes, call event

    // y axis
    // values
    var maxMemberIncome = d3.max(dataAge,function(d){return d.member_income});
    var maxMeanIncome = d3.max(dataAge,function(d){return d.mean_income});
    var maxMedianIncome = d3.max(dataAge,function(d){return d.median_income});
    var mapRaces = nestedByRace.map(function(d){return d.key});

    var scaleYAge =  d3.scaleLinear().domain([0,maxMemberIncome]).rangeRound([height, 0]);
    var scaleColorAge = d3.scaleOrdinal().domain(mapRaces).range([blue,green,red,yellow,"#000"]);

    //function to create the line
    var lineAge = d3.line()
        .x(function(d) {return scaleXAge(d.age_range); })
        .y(function(d) { return scaleYAge(d.member_income); })
        .curve(d3.curveMonotoneX);

    var distanceLine = width2/(mapAges.length * 4);

    //create groups to put the content inside them
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + margin2.t + ')').attr('class', 'axis axis-y');
    plot2.append('g').attr('transform', 'translate(' + margin2.l + ',' + (margin2.t+height2) + ')').attr('class', 'axis axis-x');
    plot2.append('g').attr('transform', 'translate(' + (margin2.l + distanceLine) + ',' + margin2.t + ')').attr('class', 'lines');

    //AXIS
    var axisLineAgeX = d3.axisBottom().scale(scaleXAge).ticks(),
        axisLineAgeY = d3.axisLeft().scale(scaleYAge).tickSizeInner(-width2).ticks(5);

    var showPlot2 = "Member income";

    drawPlot2();

    // event that's called when html option changes


    function drawPlot2(){

        plot2.select(".axis-x").transition().duration(1000).call(axisLineAgeX);
        plot2.select(".axis-y").transition().duration(1000).call(axisLineAgeY);

        var plotAges =  plot2.select(".lines")
            .selectAll(".line")
            .data(nestedByRace);

        plotAges
            .enter()
            .append("path")
            .attr("class","line")
            .attr("fill", "none")
            .attr("stroke", function(d){return scaleColorAge(d.key)})
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("d", function(d){return lineAge(d.values)});

        plotAges.exit().remove();

        plotAges.transition().duration(1000).attr("d", function(d){return lineAge(d.values)});

    }











}

function parseData(d){

    return {
        metric: d.Metric,
        first_category: d["Main category"],
        second_category: d["Characteristic"],
        third_category: d["Sub-characteristic"],
        total: +d.Total,
        under_5000: +d["Under $5,000"],
        between_5000_9999: +d["$5,000 to  $9,999"],
        between_10000_14999: +d["$10,000 to $14,999"],
        between_15000_19999: +d["$15,000 to $19,999"],
        between_20000_24999: +d["$20,000 to $24,999"],
        between_25000_29999: +d["$25,000 to $29,999"],
        between_30000_34999: +d["$30,000 to $34,999"],
        between_35000_39999: +d["$35,000 to $39,999"],
        between_40000_44999: +d["$40,000 to $44,999"],
        between_45000_49999: +d["$45,000 to $49,999"],
        between_50000_56999: +d["$50,000 to $54,999"],
        between_55000_59999: +d["$55,000 to $59,999"],
        between_60000_66999: +d["$60,000 to $64,999"],
        between_65000_69999: +d["$65,000 to $69,999"],
        between_70000_74999: +d["$70,000 to $74,999"],
        between_75000_79999: +d["$75,000 to $79,999"],
        between_80000_84999: +d["$80,000 to $84,999"],
        between_85000_89999: +d["$85,000 to $89,999"],
        between_90000_94999: +d["$90,000 to $94,999"],
        between_95000_99999: +d["$95,000 to $99,999"],
        between_100000_104999: +d["$100,000 to $104,999"],
        between_105000_109999: +d["$105,000 to $109,999"],
        between_110000_114999: +d["$90,000 to $94,999"],
        between_115000_119999: +d["$95,000 to $99,999"],
        between_120000_124999: +d["$120,000 to $124,999"],
        between_125000_129999: +d["$125,000 to $129,999"],
        between_130000_134999: +d["$90,000 to $94,999"],
        between_135000_139999: +d["$95,000 to $99,999"],
        between_140000_144999: +d["$140,000 to $144,999"],
        between_145000_149999: +d["$145,000 to $149,999"],
        between_150000_154999: +d["$90,000 to $94,999"],
        between_155000_159999: +d["$95,000 to $99,999"],
        between_160000_164999: +d["$160,000 to $164,999"],
        between_165000_169999: +d["$165,000 to $169,999"],
        between_170000_174999: +d["$90,000 to $94,999"],
        between_175000_179999: +d["$95,000 to $99,999"],
        between_180000_184999: +d["$180,000 to $184,999"],
        between_185000_189999: +d["$185,000 to $189,999"],
        between_190000_194999: +d["$90,000 to $94,999"],
        between_195000_199999: +d["$95,000 to $99,999"],
        over_200000: +d["$200,000 and over"],
        median_income: +d["Median income Value"],
        mean_income: +d["Mean income Value"],
        member_income: +d["Income per household member Value"],
    }
}



function parseIncome(d){

    return {
        race: d.race,
        age_range: d["Characteristic"],
        total: +d.Total,
        median_income: +d["Median income Value"],
        mean_income: +d["Mean income"],
        member_income: +d["Income per household member"],
    }
}

